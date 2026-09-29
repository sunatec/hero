import {
	IBM_Plex_Mono,
	Martian_Mono,
	Newsreader,
	Noto_Sans_SC,
	Noto_Serif_SC,
} from "next/font/google";

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

/** Toolbox-only (pane system); applied in app/tools/layout.tsx so other pages never load it. */
export const martianMono = Martian_Mono({
	subsets: ["latin"],
	weight: ["400", "500"],
	preload: false,
	display: "swap",
	variable: "--font-martian-mono",
});
