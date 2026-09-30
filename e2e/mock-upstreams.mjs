// Local stand-ins for Cloudflare siteverify and the Telegram Bot API, used only by e2e.
// Tokens: "e2e-pass" verifies, anything else fails. A message containing "@fail_delivery" gets a 500.
import { createServer } from "node:http";

const PORT = Number(process.env.MOCK_PORT ?? 4999);
const messages = [];

const read = (req) =>
	new Promise((resolve) => {
		let data = "";
		req.on("data", (c) => {
			data += c;
		});
		req.on("end", () => resolve(data));
	});

createServer(async (req, res) => {
	const json = (status, body) => {
		res.writeHead(status, { "content-type": "application/json" });
		res.end(JSON.stringify(body));
	};
	if (req.method === "GET" && req.url === "/health")
		return json(200, { ok: true });
	if (req.method === "POST" && req.url === "/turnstile") {
		const form = new URLSearchParams(await read(req));
		return json(200, { success: form.get("response") === "e2e-pass" });
	}
	if (
		req.method === "POST" &&
		/^\/bot[^/]+\/sendMessage$/.test(req.url ?? "")
	) {
		const body = JSON.parse(await read(req));
		if (String(body.text).includes("@fail_delivery"))
			return json(500, { ok: false });
		messages.push(body);
		return json(200, { ok: true, result: { message_id: messages.length } });
	}
	if (req.method === "GET" && req.url === "/messages")
		return json(200, messages);
	json(404, { ok: false });
}).listen(PORT, "127.0.0.1");
