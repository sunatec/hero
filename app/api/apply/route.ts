import { handleApply } from "@/lib/apply/handler";
import { sendTelegram, verifyTurnstile } from "@/lib/apply/upstream";
import { moduleBySlug } from "@/lib/content";
import type { ModuleSlug } from "@/lib/schema/common";

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
