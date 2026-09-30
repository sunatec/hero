import { modules } from "@/lib/content";
import { categoryLabel, moduleStatusLabel } from "@/lib/i18n/labels";
import { OG_SIZE } from "@/lib/og";
import { ogCard } from "@/lib/og-card";

export const alt = "0xInChain 链上情报局 · 链上工具箱";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
	return modules.map((m) => ({ slug: m.slug }));
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const m = modules.find((x) => x.slug === slug);
	if (!m) return new Response("not found", { status: 404 });
	return ogCard({
		kicker: `${m.code} / ${categoryLabel[m.category].code} · 链上工具箱`,
		title: m.nameZh,
		subtitle: m.tagline,
		tag: moduleStatusLabel[m.status],
	});
}
