import { describe, expect, it, vi } from "vitest";
import { type ApplyDeps, handleApply, MAX_BODY_BYTES } from "./handler";
import { escapeHtml, formatApplication, formatUtc8 } from "./message";

const env = { turnstileSecret: "s", tgToken: "t", tgChatId: "-100" };
const valid = {
	handle: "trader_one",
	years: "1-3",
	markets: ["perp", "dex"],
	modules: ["oi-tracker", "not-a-module"],
	source: "x",
	agree: true,
	turnstileToken: "tok",
};
const req = (body: unknown, headers: Record<string, string> = {}) =>
	new Request("http://x/api/apply", {
		method: "POST",
		headers: { "content-type": "application/json", ...headers },
		body: typeof body === "string" ? body : JSON.stringify(body),
	});
const deps = (over: Partial<ApplyDeps> = {}): ApplyDeps => ({
	verifyTurnstile: vi.fn(async () => true),
	sendTelegram: vi.fn(async () => true),
	moduleName: (s) => (s === "oi-tracker" ? "M-01 OI 异动预警" : null),
	now: () => new Date("2026-09-30T06:05:00Z"),
	...over,
});

describe("handleApply", () => {
	it("delivers a valid application", async () => {
		const d = deps();
		const r = await handleApply(req(valid), env, d);
		expect(r).toEqual({ status: 200, body: { ok: true } });
		const text = vi.mocked(d.sendTelegram).mock.calls[0]?.[2] ?? "";
		expect(text).toContain("TG：@trader_one");
		expect(text).toContain("模块：M-01 OI 异动预警");
		expect(text).not.toContain("not-a-module");
		expect(text).toContain("2026.09.30 14:05 (UTC+8)");
	});

	it("rejects when Turnstile fails and never reaches Telegram", async () => {
		const d = deps({ verifyTurnstile: async () => false });
		const r = await handleApply(req(valid), env, d);
		expect(r.status).toBe(403);
		expect(d.sendTelegram).not.toHaveBeenCalled();
	});

	it.each([
		["bad handle", { ...valid, handle: "a b" }, "handle"],
		["no markets", { ...valid, markets: [] }, "markets"],
		["not agreed", { ...valid, agree: false }, "agree"],
		["long message", { ...valid, message: "字".repeat(301) }, "message"],
		["unknown key", { ...valid, wallet: "0xabc" }, "form"],
		["no token", { ...valid, turnstileToken: "" }, "turnstileToken"],
	])("returns 400 for %s", async (_, body, field) => {
		const d = deps();
		const r = await handleApply(req(body), env, d);
		expect(r.status).toBe(400);
		if (!r.body.ok) expect(Object.keys(r.body.fields ?? {})).toContain(field);
		expect(d.verifyTurnstile).not.toHaveBeenCalled();
	});

	it("returns 400 for malformed JSON, 415 for other content types, 413 when too large", async () => {
		expect((await handleApply(req("{"), env, deps())).status).toBe(400);
		expect(
			(
				await handleApply(
					req(valid, { "content-type": "text/plain" }),
					env,
					deps(),
				)
			).status,
		).toBe(415);
		const big = { ...valid, message: "x".repeat(MAX_BODY_BYTES) };
		expect((await handleApply(req(big), env, deps())).status).toBe(413);
	});

	it("fails closed without configuration", async () => {
		const r = await handleApply(
			req(valid),
			{ ...env, turnstileSecret: undefined },
			deps(),
		);
		expect(r.status).toBe(503);
	});

	it("reports delivery failure as 502", async () => {
		const r = await handleApply(
			req(valid),
			env,
			deps({ sendTelegram: async () => false }),
		);
		expect(r.status).toBe(502);
	});

	it("passes the client IP to Turnstile", async () => {
		const d = deps();
		await handleApply(
			req(valid, { "x-forwarded-for": "1.2.3.4, 10.0.0.1" }),
			env,
			d,
		);
		expect(d.verifyTurnstile).toHaveBeenCalledWith("s", "tok", "1.2.3.4");
	});
});

describe("formatApplication", () => {
	it("escapes user input for parse_mode=HTML", () => {
		const text = formatApplication(
			{
				handle: "@abcde",
				years: "5+",
				markets: ["spot"],
				modules: [],
				source: "other",
				agree: true,
				turnstileToken: "t",
				waitlist: true,
				message: '<a href="https://evil">x</a> & <b>',
			},
			[],
		);
		expect(text).toContain(
			'&lt;a href="https://evil"&gt;x&lt;/a&gt; &amp; &lt;b&gt;',
		);
		expect(text).not.toContain("<a ");
		expect(text).toContain("<b>候补申请</b>");
		expect(text).toContain("资金：未填");
		expect(text).toContain("模块：—");
	});
	it("escapeHtml and formatUtc8", () => {
		expect(escapeHtml("a<b>&c")).toBe("a&lt;b&gt;&amp;c");
		expect(formatUtc8(new Date("2026-12-31T16:30:00Z"))).toBe(
			"2027.01.01 00:30 (UTC+8)",
		);
	});
});
