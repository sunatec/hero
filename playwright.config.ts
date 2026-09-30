import { defineConfig, devices } from "@playwright/test";

/**
 * Locally we drive the installed Google Chrome (no browser download); CI will install Chromium (M13).
 * Screenshot baselines live next to the specs in e2e/__screenshots__ and are committed.
 */
const channel = process.env.CI ? undefined : "chrome";

export default defineConfig({
	testDir: "e2e",
	snapshotPathTemplate:
		"{testDir}/__screenshots__/{testFilePath}/{projectName}/{arg}{ext}",
	fullyParallel: true,
	reporter: [["list"]],
	use: {
		baseURL: "http://localhost:3000",
		channel,
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
			},
		},
	],
});
