import { research } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { OG_SIZE } from "@/lib/og";
import { ogCard } from "@/lib/og-card";

export const alt = "0xInChain 链上情报局 · Research";
export const size = OG_SIZE;
export const contentType = "image/png";

export const dynamicParams = false;

export function generateStaticParams() {
	const slugs = research.map((r) => ({ slug: r.slug }));
	return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
}

export default async function Image({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const r = research.find((x) => x.slug === slug);
	if (!r) return new Response("not found", { status: 404 });
	return ogCard({
		kicker: `RESEARCH · ${formatDate(r.publishedAt)}`,
		title: r.title,
		subtitle: r.summary.slice(0, 42),
	});
}
