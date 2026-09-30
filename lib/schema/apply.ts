import * as z from "zod/mini";
import { CAPITAL, MARKETS, MESSAGE_MAX, SOURCES, YEARS } from "./apply-options";

export * from "./apply-options";

/**
 * /join application — shared by the form (client) and POST /api/apply (server).
 * Written with zod/mini so the form ships a few KB instead of the full zod (M12 budget).
 * Copy and options: docs/copy/join.md.
 */
export const ApplicationInput = z.strictObject({
	handle: z.pipe(
		z
			.string()
			.check(
				z.trim(),
				z.regex(/^@?[A-Za-z0-9_]{5,32}$/, "请填写有效的 TG 用户名"),
			),
		z.transform((h: string) => (h.startsWith("@") ? h : `@${h}`)),
	),
	years: z.enum(YEARS, "请选择交易年限"),
	markets: z.pipe(
		z
			.array(z.enum(MARKETS))
			.check(z.minLength(1, "至少选择一项"), z.maxLength(MARKETS.length)),
		z.transform((m: (typeof MARKETS)[number][]) => [...new Set(m)]),
	),
	// Module slugs are checked against the registry on the server (lib/apply/handler.ts).
	modules: z._default(
		z.array(z.string().check(z.maxLength(40))).check(z.maxLength(12)),
		[],
	),
	capital: z.optional(z.enum(CAPITAL)),
	source: z.enum(SOURCES, "请选择一项"),
	message: z.pipe(
		z.optional(
			z
				.string()
				.check(z.trim(), z.maxLength(MESSAGE_MAX, `最多 ${MESSAGE_MAX} 字`)),
		),
		z.transform((m?: string) => m || undefined),
	),
	agree: z.literal(true, "请先阅读并勾选"),
	turnstileToken: z
		.string()
		.check(z.minLength(1, "验证未通过，请刷新后重试"), z.maxLength(4096)),
	/** Set when the batch is full: the admin sees it as a waitlist entry. */
	waitlist: z._default(z.boolean(), false),
});
export type ApplicationInput = z.input<typeof ApplicationInput>;
export type Application = z.output<typeof ApplicationInput>;

/** Field → first error message, for inline form errors. */
export function fieldErrors(error: {
	issues: { path: PropertyKey[]; message: string }[];
}): Record<string, string> {
	const out: Record<string, string> = {};
	for (const issue of error.issues) {
		const key = String(issue.path[0] ?? "form");
		out[key] ??= issue.message;
	}
	return out;
}
