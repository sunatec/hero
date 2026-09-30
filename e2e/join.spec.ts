import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const MOCK = "http://127.0.0.1:4999";

/** Replace the Cloudflare widget with a stub that hands back a fixed token. */
async function stubTurnstile(page: Page, token = "e2e-pass") {
	await page.route("https://challenges.cloudflare.com/turnstile/**", (route) =>
		route.fulfill({
			contentType: "text/javascript",
			body: `window.turnstile = {
				render(el, o) { el.textContent = "turnstile-stub"; setTimeout(() => o.callback(${JSON.stringify(token)}), 50); return "w1"; },
				reset() {}, remove() {}
			};`,
		}),
	);
}

const uid = () =>
	`e2e_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function fill(page: Page, handle: string, message = "") {
	await page.getByLabel("TG 用户名").fill(handle);
	await page.getByRole("radio", { name: "1–3 年" }).check();
	await page.getByRole("checkbox", { name: "永续合约" }).check();
	await page.getByRole("checkbox", { name: "OI 异动预警" }).check();
	await page.getByRole("radio", { name: "X", exact: true }).check();
	if (message) await page.getByLabel(/想说的话/).fill(message);
	await page.getByRole("checkbox", { name: /我已阅读并理解/ }).check();
	await expect(page.getByText("turnstile-stub")).toBeVisible();
}

test.describe("join flow", () => {
	test("a valid application reaches the admin chat, escaped", async ({
		page,
		request,
	}) => {
		await stubTurnstile(page);
		await page.goto("/join");
		const handle = uid();
		await fill(page, handle, "<b>hi</b> & bye");
		await page.getByRole("button", { name: "提交申请" }).click();
		await expect(page).toHaveURL(/\/join\/submitted$/);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"申请已提交",
		);

		const msgs = (await (await request.get(`${MOCK}/messages`)).json()) as {
			chat_id: string;
			text: string;
			parse_mode: string;
		}[];
		const m = msgs.find((x) => x.text.includes(`@${handle}`));
		expect(m, "message delivered to mock Telegram").toBeTruthy();
		expect(m?.parse_mode).toBe("HTML");
		expect(m?.text).toContain("模块：M-01 OI 异动预警");
		expect(m?.text).toContain("留言：&lt;b&gt;hi&lt;/b&gt; &amp; bye");
	});

	test("client-side validation lists errors and blocks submission", async ({
		page,
	}) => {
		await stubTurnstile(page);
		await page.goto("/join");
		await expect(page.getByText("turnstile-stub")).toBeVisible();
		await page.getByRole("button", { name: "提交申请" }).click();
		await expect(page.getByText(/有 \d 处需要修改/)).toBeVisible();
		await expect(page.getByText("请填写有效的 TG 用户名")).toBeVisible();
		await expect(page.getByText("至少选择一项")).toBeVisible();
		await expect(page.getByText("请先阅读并勾选")).toBeVisible();
		await expect(page).toHaveURL(/\/join$/);
	});

	test("a failed Turnstile check is rejected by the server", async ({
		page,
	}) => {
		await stubTurnstile(page, "e2e-fail");
		await page.goto("/join");
		await fill(page, uid());
		await page.getByRole("button", { name: "提交申请" }).click();
		await expect(page.getByText("验证未通过，请刷新后重试")).toBeVisible();
		await expect(page).toHaveURL(/\/join$/);
	});

	test("delivery failure shows the TG fallback", async ({ page }) => {
		await stubTurnstile(page);
		await page.goto("/join");
		await fill(page, "fail_delivery");
		await page.getByRole("button", { name: "提交申请" }).click();
		await expect(page.getByText(/提交没有成功/)).toContainText(
			"@gongxifacai_998",
		);
	});
});

test.describe("api/apply", () => {
	test("rejects bad input with 400 and a bad token with 403", async ({
		request,
	}) => {
		const bad = await request.post("/api/apply", { data: { handle: "x" } });
		expect(bad.status()).toBe(400);
		const forbidden = await request.post("/api/apply", {
			data: {
				handle: uid(),
				years: "5+",
				markets: ["spot"],
				source: "x",
				agree: true,
				turnstileToken: "e2e-fail",
			},
		});
		expect(forbidden.status()).toBe(403);
		expect(await forbidden.json()).toEqual({
			ok: false,
			error: "turnstile_failed",
		});
	});
});

test.describe("trust pages", () => {
	test("verify lists official accounts from site.config", async ({ page }) => {
		await page.goto("/verify");
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(
			"只认这些账号",
		);
		await expect(
			page.getByRole("cell", { name: "@gongxifacai_998" }),
		).toBeVisible();
		await expect(page.locator("main").getByText("不会主动私信")).toBeVisible();
	});

	for (const [doc, title] of [
		["risk", "风险披露"],
		["privacy", "隐私说明"],
		["terms", "服务条款"],
	] as const) {
		test(`legal/${doc} renders`, async ({ page }) => {
			await page.goto(`/legal/${doc}`);
			await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
			await expect(page.locator("main").getByText("最后更新：")).toBeVisible();
		});
	}

	for (const path of ["/join", "/join/submitted", "/verify", "/legal/terms"]) {
		test(`axe: ${path}`, async ({ page }) => {
			await stubTurnstile(page);
			await page.goto(path);
			const r = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
				.analyze();
			const blocking = r.violations.filter(
				(v) => v.impact === "serious" || v.impact === "critical",
			);
			expect(
				blocking.map(
					(v) =>
						`${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
				),
			).toEqual([]);
		});
	}
});
