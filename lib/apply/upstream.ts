/**
 * Outbound calls for POST /api/apply. Base URLs are overridable so e2e can point them at a
 * local mock (e2e/mock-upstreams.ts); production always uses the real hosts.
 */
const TURNSTILE_URL =
	process.env.TURNSTILE_VERIFY_URL ??
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TG_API = process.env.TG_API_BASE ?? "https://api.telegram.org";
const TIMEOUT_MS = 8000;

export async function verifyTurnstile(
	secret: string,
	token: string,
	ip?: string,
): Promise<boolean> {
	const body = new URLSearchParams({ secret, response: token });
	if (ip) body.set("remoteip", ip);
	try {
		const res = await fetch(TURNSTILE_URL, {
			method: "POST",
			body,
			signal: AbortSignal.timeout(TIMEOUT_MS),
		});
		if (!res.ok) return false;
		const data = (await res.json()) as { success?: unknown };
		return data.success === true;
	} catch {
		return false;
	}
}

export async function sendTelegram(
	token: string,
	chatId: string,
	text: string,
): Promise<boolean> {
	try {
		const res = await fetch(`${TG_API}/bot${token}/sendMessage`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: "HTML",
				link_preview_options: { is_disabled: true },
			}),
			signal: AbortSignal.timeout(TIMEOUT_MS),
		});
		return res.ok;
	} catch {
		return false;
	}
}
