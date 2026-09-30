import { OG_SIZE } from "@/lib/og";
import { ogCard } from "@/lib/og-card";

export const alt = "0xInChain 链上情报局 · 可复盘的链上情报";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Static brand card — the default preview for every page without its own image. */
export default function Image() {
	return ogCard({
		kicker: "FILE № IC-2026 · ON-CHAIN INTELLIGENCE BUREAU",
		title: "链上情报局",
		subtitle: "追踪链上资金流向，公开台账记录每一条信号。",
	});
}
