"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const COUNT_MS = 800;
const MAX_STAGGER = 12;

/**
 * Motion island (WEBSITE_PLAN §11.7) — no animation library, just one IntersectionObserver.
 * Only elements that start below the fold are ever hidden, so the first frame is always fully
 * readable; with prefers-reduced-motion nothing is touched. Mark elements with
 * `data-reveal="line" | "rows" | "redact" | "stamp"`, and numbers with `data-count`.
 */
export function Motion() {
	const pathname = usePathname();
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-scan the new page after each client navigation
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!e.isIntersecting) continue;
					const el = e.target as HTMLElement;
					io.unobserve(el);
					el.dataset.motion = "shown";
					if (el.dataset.count !== undefined) countUp(el);
				}
			},
			{ rootMargin: "0px 0px -8% 0px" },
		);
		const frame = requestAnimationFrame(() => {
			const fold = window.innerHeight;
			for (const el of document.querySelectorAll<HTMLElement>(
				"[data-reveal], [data-count]",
			)) {
				if (el.dataset.motion) continue;
				if (el.getBoundingClientRect().top < fold) continue; // visible at load: leave as is
				el.dataset.motion = "pending";
				if (el.dataset.reveal === "rows") {
					[...el.children].forEach((child, i) => {
						(child as HTMLElement).style.setProperty(
							"--i",
							String(Math.min(i, MAX_STAGGER)),
						);
					});
				}
				io.observe(el);
			}
		});
		return () => {
			cancelAnimationFrame(frame);
			io.disconnect();
		};
	}, [pathname]);
	return null;
}

function countUp(el: HTMLElement) {
	const target = Number(el.dataset.count);
	if (!Number.isFinite(target) || target <= 0) return;
	const final = el.textContent ?? String(target);
	const start = performance.now();
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / COUNT_MS);
		const eased = 1 - (1 - t) ** 3;
		el.textContent = t < 1 ? String(Math.round(target * eased)) : final;
		if (t < 1) requestAnimationFrame(step);
	};
	requestAnimationFrame(step);
}
