/**
 * Plausible custom events (WEBSITE_PLAN §20). A no-op until the Plausible script is loaded
 * (NEXT_PUBLIC_PLAUSIBLE_DOMAIN), so callers never need to guard. Never send form contents.
 */
type Props = Record<string, string | number>;
type Plausible = (event: string, options?: { props?: Props }) => void;

declare global {
	interface Window {
		plausible?: Plausible;
	}
}

export function track(event: string, props?: Props) {
	if (typeof window === "undefined") return;
	window.plausible?.(event, props ? { props } : undefined);
}

const SECTION_LOCATION: Record<string, string> = {
	"hero-title": "hero",
	"sample-h": "redaction",
	"join-h": "join-section",
};

/** Where a CTA sits, per the §20 vocabulary (nav / hero / sticky / join-section / redaction / ledger-detail). */
export function ctaLocation(el: Element, pathname: string): string {
	const tagged = el.closest<HTMLElement>("[data-track-location]")?.dataset
		.trackLocation;
	if (tagged) return tagged;
	if (el.closest("[data-sticky-apply]")) return "sticky";
	if (el.closest("header, dialog")) return "nav";
	const section = el
		.closest("section[aria-labelledby]")
		?.getAttribute("aria-labelledby");
	if (section && SECTION_LOCATION[section]) return SECTION_LOCATION[section];
	if (pathname.startsWith("/ledger/")) return "ledger-detail";
	return pathname;
}

/** Map a clicked link to its §20 event, or null when it is not tracked. */
export function linkEvent(
	a: HTMLAnchorElement,
	pathname: string,
): { event: string; props: Props } | null {
	const url = new URL(a.href, window.location.href);
	const location = ctaLocation(a, pathname);
	if (url.origin === window.location.origin) {
		if (url.pathname === "/join")
			return { event: "cta_apply_click", props: { location } };
		const lang = a.getAttribute("lang");
		if (lang) return { event: "lang_switch", props: { to: lang } };
		return null;
	}
	if (url.hostname === "x.com" || url.hostname === "twitter.com")
		return { event: "outbound_x", props: { location } };
	if (url.hostname === "t.me")
		return { event: "outbound_tg", props: { location } };
	return null;
}
