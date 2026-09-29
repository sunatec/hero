/**
 * Fonts for next/og. Google Fonts returns a TTF containing only the glyphs in `text` when asked
 * with a Safari UA (the same trick @vercel/og uses), so each image downloads a few KB.
 * If the network is unavailable the image still renders with the built-in font (CJK may be missing).
 */
const UA =
	"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

export type OgFont = {
	name: string;
	data: ArrayBuffer;
	weight: 400 | 500 | 700 | 900;
	style: "normal";
};

async function load(
	family: string,
	weight: OgFont["weight"],
	text: string,
): Promise<OgFont | null> {
	try {
		const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
		const css = await (
			await fetch(url, {
				headers: { "User-Agent": UA },
				signal: AbortSignal.timeout(10_000),
			})
		).text();
		const src = css.match(
			/src: url\((.+?)\) format\('(opentype|truetype)'\)/,
		)?.[1];
		if (!src) return null;
		const res = await fetch(src, { signal: AbortSignal.timeout(10_000) });
		if (!res.ok) return null;
		return {
			name: family,
			data: await res.arrayBuffer(),
			weight,
			style: "normal",
		};
	} catch {
		return null;
	}
}

export async function ogFonts(text: string): Promise<OgFont[]> {
	const unique = [...new Set(text)].join("");
	const fonts = await Promise.all([
		load("Noto Serif SC", 900, unique),
		load("IBM Plex Mono", 500, unique),
	]);
	return fonts.filter((f): f is OgFont => f !== null);
}

export const OG_SIZE = { width: 1200, height: 630 };

export const OG_COLORS = {
	ink0: "#14161A",
	ink1: "#1B1E23",
	line: "#343841",
	bone: "#E9E4D8",
	boneDim: "#A8A398",
	stamp: "#E8604A",
	dossier: "#C9A96A",
	gain: "#6FBF8E",
	loss: "#E07A68",
	redact: "#0B0C0E",
};
