import {
	IBM_Plex_Mono,
	Newsreader,
	Noto_Sans_SC,
	Noto_Serif_SC,
} from "next/font/google";
import localFont from "next/font/local";

/*
 * CJK fonts are never preloaded: Google Fonts serves them as unicode-range slices that the
 * browser fetches on demand. Only the Latin display face is preloaded (WEBSITE_PLAN §11.3, §16).
 */
export const serifZh = Noto_Serif_SC({
	weight: ["700", "900"],
	preload: false,
	display: "swap",
	variable: "--font-noto-serif-sc",
});

export const sansZh = Noto_Sans_SC({
	weight: ["400", "500"],
	preload: false,
	display: "swap",
	variable: "--font-noto-sans-sc",
});

export const latin = Newsreader({
	subsets: ["latin"],
	style: ["normal", "italic"],
	axes: ["opsz"],
	display: "swap",
	variable: "--font-newsreader",
});

export const plexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	preload: false,
	display: "swap",
	variable: "--font-plex-mono",
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
