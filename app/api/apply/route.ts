import { handleApply } from "@/lib/apply/handler";
import { createRateLimiter } from "@/lib/apply/rate-limit";
import { sendTelegram, verifyTurnstile } from "@/lib/apply/upstream";
import { moduleBySlug } from "@/lib/content";
import type { ModuleSlug } from "@/lib/schema/common";

// Per instance: 5 submissions per IP per 10 min, 3 per TG handle per day.
const ipLimit = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });
const handleLimit = createRateLimiter({ limit: 3, windowMs: 24 * 3_600_000 });
// e2e submits many applications from one machine; it turns the limiter off explicitly.
const limited = process.env.APPLY_RATE_LIMIT !== "off";
const allow = (key: string) =>
	!limited || (key.startsWith("ip:") ? ipLimit(key) : handleLimit(key));

/** The site's only dynamic endpoint (WEBSITE_PLAN §13.2). Nothing from the body is logged or stored. */
export async function POST(request: Request) {
	const result = await handleApply(
		request,
		{
			turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
			tgToken: process.env.TG_BOT_TOKEN,
			tgChatId: process.env.TG_ADMIN_CHAT_ID,
		},
		{
			verifyTurnstile,
			sendTelegram,
			allow,
			moduleName: (slug) => {
				const m = moduleBySlug(slug as ModuleSlug);
				return m && m.status !== "planned" ? `${m.code} ${m.nameZh}` : null;
			},
		},
	);
	if (result.status >= 500) {
		// Outcome only — never the request body.
		console.error(`[apply] ${result.body.ok ? "ok" : result.body.error}`);
	}
	return Response.json(result.body, {
		status: result.status,
		headers: { "cache-control": "no-store" },
	});
}
