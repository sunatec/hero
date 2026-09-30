import { z } from "zod";

/**
 * /join application — shared by the form (client) and POST /api/apply (server).
 * Copy and options: docs/copy/join.md.
 */
export const YEARS = ["<1", "1-3", "3-5", "5+"] as const;
export const yearsLabel: Record<(typeof YEARS)[number], string> = {
	"<1": "1 年以内",
	"1-3": "1–3 年",
	"3-5": "3–5 年",
	"5+": "5 年以上",
};

export const MARKETS = ["spot", "perp", "dex", "meme", "rwa"] as const;
export const marketLabel: Record<(typeof MARKETS)[number], string> = {
	spot: "现货",
	perp: "永续合约",
	dex: "链上 DEX",
	meme: "Meme",
	rwa: "美股代币化资产",
};

export const CAPITAL = [
	"na",
	"<10k",
	"10k-100k",
	"100k-500k",
	"500k+",
] as const;
export const capitalLabel: Record<(typeof CAPITAL)[number], string> = {
	na: "不便透露",
	"<10k": "1 万 U 以下",
	"10k-100k": "1–10 万 U",
	"100k-500k": "10–50 万 U",
	"500k+": "50 万 U 以上",
};

export const SOURCES = ["x", "telegram", "friend", "search", "other"] as const;
export const sourceLabel: Record<(typeof SOURCES)[number], string> = {
	x: "X",
	telegram: "Telegram",
	friend: "朋友推荐",
	search: "搜索",
	other: "其他",
};

export const MESSAGE_MAX = 300;

export const ApplicationInput = z.strictObject({
	handle: z
		.string()
		.trim()
		.regex(/^@?[A-Za-z0-9_]{5,32}$/, "请填写有效的 TG 用户名")
		.transform((h) => (h.startsWith("@") ? h : `@${h}`)),
	years: z.enum(YEARS, "请选择交易年限"),
	markets: z
		.array(z.enum(MARKETS))
		.min(1, "至少选择一项")
		.max(MARKETS.length)
		.transform((m) => [...new Set(m)]),
	// Module slugs are checked against the registry on the server (lib/apply/handler.ts).
	modules: z.array(z.string().max(40)).max(12).default([]),
	capital: z.enum(CAPITAL).optional(),
	source: z.enum(SOURCES, "请选择一项"),
	message: z
		.string()
		.trim()
		.max(MESSAGE_MAX, `最多 ${MESSAGE_MAX} 字`)
		.optional()
		.transform((m) => m || undefined),
	agree: z.literal(true, "请先阅读并勾选"),
	turnstileToken: z.string().min(1, "验证未通过，请刷新后重试").max(4096),
	/** Set when the batch is full: the admin sees it as a waitlist entry. */
	waitlist: z.boolean().default(false),
});
export type ApplicationInput = z.input<typeof ApplicationInput>;
export type Application = z.output<typeof ApplicationInput>;

/** Field → first error message, for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
	const out: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? "form");
		out[key] ??= issue.message;
	}
	return out;
}
