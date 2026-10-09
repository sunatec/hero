/**
 * Close an open signal: add the member-only fields, fetch the price series (A7) and compute MFE/MAE.
 *
 *   pnpm close:signal IC-2026-0003 --status hit --asset '$AERO' --entry 1.02 --exit 1.18 \
 *     --closed-at 2026-10-16T09:00:00+08:00 --evidence tg:/ledger/IC-2026-0003/tg.webp \
 *     [--targets 1.18,1.30] [--stop 0.96] [--invalidation '…'] [--x-url https://x.com/…] \
 *     [--symbol AEROUSDT] [--no-series]
 *
 * If the signal was opened with a SHA-256 commitment, --asset/--entry/--targets/--stop/--invalidation
 * default to the committed values and the salt is revealed. Passing different values fails the
 * build's hash check on purpose.
 *
 * Evidence is `type:value`, repeatable. type ∈ tg|tx|address|chart|x; the value is a URL or an
 * image path under public/ (e.g. /ledger/IC-2026-0003/tg.webp).
 */
import { parseArgs } from "node:util";
import {
	type CloseInput,
	closeFrontmatter,
	defaultSymbol,
	type Interval,
	type Klines,
	parseBinanceKlines,
	pickInterval,
} from "../lib/ledger/close";
import {
	fail,
	PLACEHOLDER,
	readSecret,
	readSignal,
	writeSignal,
} from "./ledger-io";

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		status: { type: "string" },
		asset: { type: "string" },
		entry: { type: "string" },
		exit: { type: "string" },
		"closed-at": { type: "string" },
		targets: { type: "string" },
		stop: { type: "string" },
		invalidation: { type: "string" },
		"x-url": { type: "string" },
		evidence: { type: "string", multiple: true },
		symbol: { type: "string" },
		"no-series": { type: "boolean", default: false },
	},
});

const id =
	positionals[0] ??
	fail("usage: pnpm close:signal IC-YYYY-NNNN --status … (see file header)");
const STATUSES = ["hit", "invalidated", "stopped", "expired"] as const;
const status =
	STATUSES.find((s) => s === values.status) ??
	fail(`--status must be one of: ${STATUSES.join(", ")}`);
const num = (name: string, v?: string) => {
	const n = Number(v);
	if (!v || !Number.isFinite(n) || n <= 0)
		fail(`--${name} must be a positive number`);
	return n;
};
const evidence: CloseInput["evidence"] = (values.evidence ?? []).map((e) => {
	const i = e.indexOf(":");
	const type = e.slice(0, i) as CloseInput["evidence"][number]["type"];
	const value = e.slice(i + 1);
	if (!["tg", "tx", "address", "chart", "x"].includes(type) || !value)
		fail(`bad --evidence "${e}" (want type:value)`);
	return /^https?:\/\//.test(value)
		? { type, url: value }
		: { type, image: value };
});
if (!evidence.length) fail("at least one --evidence is required");

const { data, body } = readSignal(id);
if (data.status !== "open") fail(`${id} is already ${String(data.status)}`);

const secret = data.commitHash ? readSecret(id) : undefined;
if (data.commitHash && !secret)
	fail(
		`${id} has a commitHash but .ledger-secrets/${id}.json is missing — restore it from backup`,
	);
const committed = secret?.fields;

const input: CloseInput = {
	status,
	asset:
		values.asset ??
		committed?.asset ??
		fail("--asset is required, e.g. '$ARB'"),
	entryPrice: values.entry
		? num("entry", values.entry)
		: (committed?.entryPrice ?? num("entry", values.entry)),
	exitPrice: num("exit", values.exit),
	closedAt:
		values["closed-at"] ??
		fail("--closed-at is required (ISO 8601 with +08:00)"),
	targets: values.targets
		? values.targets.split(",").map((t) => num("targets", t))
		: committed?.targets,
	stopLoss: values.stop ? num("stop", values.stop) : committed?.stopLoss,
	invalidation: values.invalidation ?? committed?.invalidation,
	xUrl: values["x-url"],
	evidence,
	commitSalt: secret?.salt,
};

async function fetchSeries(
	openedAt: string,
): Promise<
	| { source: string; interval: Interval; start: string; klines: Klines }
	| undefined
> {
	if (values["no-series"]) return undefined;
	const symbol = values.symbol ?? defaultSymbol(input.asset);
	const interval = pickInterval(openedAt, input.closedAt);
	const query = new URLSearchParams({
		symbol,
		interval,
		startTime: String(Date.parse(openedAt)),
		endTime: String(Date.parse(input.closedAt)),
		limit: "1000",
	}).toString();
	// The public market-data mirror first: api.binance.com is blocked on some networks.
	const hosts = ["https://data-api.binance.vision", "https://api.binance.com"];
	const errors: string[] = [];
	for (const host of hosts) {
		try {
			const res = await fetch(`${host}/api/v3/klines?${query}`, {
				signal: AbortSignal.timeout(15_000),
			});
			const klines = parseBinanceKlines(await res.json());
			return { source: `binance:${symbol}`, interval, start: openedAt, klines };
		} catch (e) {
			errors.push(`${new URL(host).host}: ${(e as Error).message}`);
		}
	}
	console.warn(`! price series unavailable (${symbol}): ${errors.join("; ")}`);
	console.warn(
		"  Closing without a series — the chart falls back to the three key prices.",
	);
	console.warn(
		"  Use --symbol if the pair differs from $ASSET+USDT, or --no-series to skip.",
	);
	return undefined;
}

const series = await fetchSeries(String(data.openedAt));
try {
	const closed = closeFrontmatter(
		data as Parameters<typeof closeFrontmatter>[0],
		input,
		series,
	);
	const nextBody = body.trim()
		? body
		: `\n**依据**：${PLACEHOLDER}\n\n**复盘**：${PLACEHOLDER}\n`;
	const path = writeSignal(id, closed, nextBody);
	console.log(`✓ ${id} closed as ${status} → ${path}`);
	console.log(
		`  closed ${closed.closedReturnPct}% · MFE ${closed.mfePct}% · MAE ${closed.maePct}%${series ? ` · ${series.klines.closes.length} × ${series.interval} candles` : ""}`,
	);
	if (nextBody.includes(PLACEHOLDER))
		console.log(
			`  Fill in the ${PLACEHOLDER} thesis and review before publishing.`,
		);
} catch (e) {
	fail((e as Error).message);
}
