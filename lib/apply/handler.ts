import { ApplicationInput, fieldErrors } from "@/lib/schema/apply";
import { formatApplication } from "./message";

export type ApplyEnv = {
	turnstileSecret?: string;
	tgToken?: string;
	tgChatId?: string;
};

export type ApplyDeps = {
	verifyTurnstile: (
		secret: string,
		token: string,
		ip?: string,
	) => Promise<boolean>;
	sendTelegram: (
		token: string,
		chatId: string,
		text: string,
	) => Promise<boolean>;
	/** slug → display name for known modules; unknown slugs are dropped. */
	moduleName: (slug: string) => string | null;
	/** Returns false when the key (`ip:…` or `handle:…`) is over its limit. Optional in tests. */
	allow?: (key: string) => boolean;
	now?: () => Date;
};

export type ApplyResult =
	| { status: 200; body: { ok: true } }
	| {
			status: 400 | 403 | 413 | 415 | 429 | 502 | 503;
			body: { ok: false; error: string; fields?: Record<string, string> };
	  };

export const MAX_BODY_BYTES = 8 * 1024;

/**
 * Pure core of POST /api/apply: parse → Turnstile → Telegram.
 * Never logs or returns the submitted content (WEBSITE_PLAN M9 acceptance).
 */
export async function handleApply(
	req: Request,
	env: ApplyEnv,
	deps: ApplyDeps,
): Promise<ApplyResult> {
	if (!env.turnstileSecret || !env.tgToken || !env.tgChatId) {
		return { status: 503, body: { ok: false, error: "not_configured" } };
	}
	const ip =
		req.headers.get("cf-connecting-ip") ??
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
		undefined;
	if (ip && deps.allow && !deps.allow(`ip:${ip}`)) {
		return { status: 429, body: { ok: false, error: "rate_limited" } };
	}
	if (!req.headers.get("content-type")?.includes("application/json")) {
		return {
			status: 415,
			body: { ok: false, error: "unsupported_media_type" },
		};
	}
	if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
		return { status: 413, body: { ok: false, error: "too_large" } };
	}
	const raw = await req.text();
	if (raw.length > MAX_BODY_BYTES) {
		return { status: 413, body: { ok: false, error: "too_large" } };
	}
	let json: unknown;
	try {
		json = JSON.parse(raw);
	} catch {
		return { status: 400, body: { ok: false, error: "invalid_json" } };
	}
	const parsed = ApplicationInput.safeParse(json);
	if (!parsed.success) {
		return {
			status: 400,
			body: { ok: false, error: "invalid", fields: fieldErrors(parsed.error) },
		};
	}
	const a = parsed.data;
	if (deps.allow && !deps.allow(`handle:${a.handle.toLowerCase()}`)) {
		return { status: 429, body: { ok: false, error: "rate_limited" } };
	}
	if (
		!(await deps.verifyTurnstile(env.turnstileSecret, a.turnstileToken, ip))
	) {
		return { status: 403, body: { ok: false, error: "turnstile_failed" } };
	}
	const names = a.modules
		.map((s) => deps.moduleName(s))
		.filter((n): n is string => n !== null);
	const text = formatApplication(a, names, deps.now?.() ?? new Date());
	if (!(await deps.sendTelegram(env.tgToken, env.tgChatId, text))) {
		return { status: 502, body: { ok: false, error: "delivery_failed" } };
	}
	return { status: 200, body: { ok: true } };
}
