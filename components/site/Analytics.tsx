"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { linkEvent, track } from "@/lib/analytics";

const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/**
 * Loads Plausible (cookie-free, WEBSITE_PLAN §20) and tracks link-based events by delegation, so
 * server components only need markup. Explicit events live next to their UI (ledger filters,
 * redaction tips, the join form).
 */
export function Analytics() {
	const pathname = usePathname();
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			const a = (e.target as Element | null)?.closest?.("a[href]");
			if (!(a instanceof HTMLAnchorElement)) return;
			const hit = linkEvent(a, pathname);
			if (hit) track(hit.event, hit.props);
		};
		document.addEventListener("click", onClick, { capture: true });
		return () =>
			document.removeEventListener("click", onClick, { capture: true });
	}, [pathname]);

	if (!DOMAIN) return null;
	return (
		<>
			<Script
				defer
				data-domain={DOMAIN}
				src="https://plausible.io/js/script.js"
				strategy="afterInteractive"
			/>
			{/* Queue events fired before the script loads (Plausible's documented stub). */}
			<Script id="plausible-queue" strategy="afterInteractive">
				{
					"window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}"
				}
			</Script>
		</>
	);
}
