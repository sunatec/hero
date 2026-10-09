import { defineConfig, devices } from "@playwright/test";

/**
 * Locally we drive the installed Google Chrome (no browser download); CI will install Chromium (M13).
 * Screenshot baselines live next to the specs in e2e/__screenshots__ and are committed.
 */
const channel = process.env.CI ? undefined : "chrome";

/**
 * CROSS_BROWSER=1 adds Firefox, desktop Safari (WebKit) and iPhone Safari running the functional
 * suites (visual baselines are Chrome-only). Needs `pnpm exec playwright install firefox webkit`.
 */
const SMOKE = /(ledger|cases|tools|join|keyboard|m7|seo)\.spec\.ts$/;
const crossBrowser = process.env.CROSS_BROWSER
	? [
			{
				name: "firefox",
				testMatch: SMOKE,
				use: { ...devices["Desktop Firefox"] },
			},
			{
				name: "webkit",
				testMatch: SMOKE,
				use: { ...devices["Desktop Safari"] },
			},
			{ name: "iphone", testMatch: SMOKE, use: { ...devices["iPhone 15"] } },
		]
	: [];

export default defineConfig({
	testDir: "e2e",
	snapshotPathTemplate:
		"{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
	fullyParallel: true,
	// On CI the github reporter turns failures into check annotations (readable without logs access).
	reporter: process.env.CI ? [["github"], ["list"]] : [["list"]],
	use: {
		baseURL: "http://localhost:3000",
		reducedMotion: "reduce",
	},
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.01,
			animations: "disabled",
			stylePath: "e2e/screenshot.css",
		},
	},
	projects: [
		...crossBrowser,
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				channel,
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "mobile",
			use: {
				...devices["Pixel 7"],
				channel,
				viewport: { width: 390, height: 844 },
			},
		},
	],
	webServer: [
		{
			// Stand-ins for Turnstile siteverify and the Telegram Bot API (e2e/join.spec.ts).
			command: "node e2e/mock-upstreams.mjs",
			url: "http://127.0.0.1:4999/health",
			reuseExistingServer: true,
		},
		{
			command: "pnpm dev",
			url: "http://localhost:3000",
			// A dev server started by hand lacks the env below; /join tests then fail loudly.
			reuseExistingServer: true,
			timeout: 120_000,
			env: {
				NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
				TURNSTILE_SECRET_KEY: "e2e-secret",
				TURNSTILE_VERIFY_URL: "http://127.0.0.1:4999/turnstile",
				TG_API_BASE: "http://127.0.0.1:4999",
				TG_BOT_TOKEN: "e2e-token",
				TG_ADMIN_CHAT_ID: "-1000000000000",
				APPLY_RATE_LIMIT: "off",
			},
		},
	],
});
