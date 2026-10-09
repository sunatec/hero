/**
 * Check the admin-chat wiring before launch (docs/ops/launch.md step 3):
 *   TG_BOT_TOKEN=… TG_ADMIN_CHAT_ID=… pnpm tg:ping
 * Sends one message through the same code path as /api/apply. Prints no secrets.
 */
import { sendTelegram } from "../lib/apply/upstream";

const token = process.env.TG_BOT_TOKEN;
const chat = process.env.TG_ADMIN_CHAT_ID;
if (!token || !chat) {
	console.error("Set TG_BOT_TOKEN and TG_ADMIN_CHAT_ID first.");
	process.exit(1);
}
const ok = await sendTelegram(
	token,
	chat,
	`🗂 <b>连通测试</b> · ${new Date().toISOString()}\n来自 pnpm tg:ping。收到这条说明申请表单能送达本群。`,
);
console.log(
	ok
		? "✓ delivered — check the admin chat"
		: "✗ delivery failed (wrong token / chat id, or the bot is not in the group)",
);
process.exit(ok ? 0 : 1);
