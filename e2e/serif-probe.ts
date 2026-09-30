/**
 * Runs in the page: text rendered in the display serif, grouped by weight ("700" | "900").
 * Shared by scripts/fonts-subset.ts (builds the subset) and e2e/fonts.spec.ts (guards it).
 */
export const serifTextProbe = () => {
	const out: Record<string, string> = {};
	// next/font/local renames the family; read the generated name from the CSS variable.
	const local = getComputedStyle(document.documentElement)
		.getPropertyValue("--font-noto-serif-sc")
		.split(",")[0]
		?.trim()
		.replace(/['"]/g, "");
	const isSerif = (family: string) =>
		family.includes("Noto Serif SC") || (!!local && family.includes(local));
	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
	for (let n = walker.nextNode(); n; n = walker.nextNode()) {
		const el = n.parentElement;
		if (!el || !n.textContent?.trim()) continue;
		const cs = getComputedStyle(el);
		if (!isSerif(cs.fontFamily)) continue;
		const w = Number(cs.fontWeight) >= 800 ? "900" : "700";
		out[w] = (out[w] ?? "") + n.textContent;
	}
	// Pseudo-element text (e.g. redaction tips) is sans; titles attribute text is not rendered.
	return out;
};
