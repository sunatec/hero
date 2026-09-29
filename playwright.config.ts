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
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
		timeout: 120_000,
	},
});
