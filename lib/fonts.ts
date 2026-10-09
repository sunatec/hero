import localFont from "next/font/local";

/*
 * Every face is self-hosted (next/font/local): builds never depend on reaching Google Fonts,
 * which made CI builds flaky (M14). Latin faces come from @fontsource (OFL-1.1).
 */

/*
 * CJK fonts are never preloaded: Google Fonts serves them as unicode-range slices that the
 * browser fetches on demand (WEBSITE_PLAN §11.3, §16). Body CJK text uses the system font
 * (PingFang / YaHei / Noto Sans CJK, see --font-sans): the web font cost ~1 MB per page (M12).
 */
/**
 * Display serif, self-hosted as a subset of exactly the glyphs the site renders in it
 * (scripts/fonts-subset.ts → app/fonts). ~125 KB instead of ~1.1 MB of Google unicode-range
 * slices per page, and no render-blocking 68 KB @font-face stylesheet. e2e/fonts.spec.ts
 * fails when copy introduces a character the subset lacks — rerun `pnpm fonts:subset`.
 */
export const serifZh = localFont({
	src: [
		{ path: "../app/fonts/noto-serif-sc-700.woff2", weight: "700" },
		{ path: "../app/fonts/noto-serif-sc-900.woff2", weight: "900" },
	],
	display: "swap",
	variable: "--font-noto-serif-sc",
	fallback: ["Songti SC", "serif"],
});

/** Static 400/500 cuts (~25 KB each) instead of the 136 KB opsz variable file (M12). */
export const latin = localFont({
	src: [
		{
			path: "../node_modules/@fontsource/newsreader/files/newsreader-latin-400-normal.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../node_modules/@fontsource/newsreader/files/newsreader-latin-400-italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../node_modules/@fontsource/newsreader/files/newsreader-latin-500-normal.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../node_modules/@fontsource/newsreader/files/newsreader-latin-500-italic.woff2",
			weight: "500",
			style: "italic",
		},
	],
	preload: false,
	display: "swap",
	variable: "--font-newsreader",
	fallback: ["Georgia", "serif"],
});

export const plexMono = localFont({
	src: [
		{
			path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
			weight: "400",
		},
		{
			path: "../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
			weight: "500",
		},
	],
	preload: false,
	display: "swap",
	variable: "--font-plex-mono",
	fallback: ["ui-monospace", "monospace"],
});

/**
 * Toolbox-only (pane system); applied in app/tools/layout.tsx so other pages never load it.
 * Self-hosted from @fontsource (OFL-1.1): Turbopack 16.3 fails to resolve the Google-hosted
 * Martian Mono files ("next/font/google queries have exactly one entry").
 */
export const martianMono = localFont({
	src: [
		{
			path: "../node_modules/@fontsource/martian-mono/files/martian-mono-latin-400-normal.woff2",
			weight: "400",
		},
		{
			path: "../node_modules/@fontsource/martian-mono/files/martian-mono-latin-500-normal.woff2",
			weight: "500",
		},
	],
	preload: false,
	display: "swap",
	variable: "--font-martian-mono",
});
