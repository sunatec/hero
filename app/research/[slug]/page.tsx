import { allResearch } from "content-collections";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	const slugs = allResearch
		.filter((r) => !r.draft)
		.map((r) => ({ slug: r.slug }));
	// Next requires at least one param for output with dynamicParams=false; the sentinel 404s.
	return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
}

export default async function ResearchPage({ params }: Props) {
	const { slug } = await params;
	const article = allResearch.find((r) => r.slug === slug && !r.draft);
	if (!article) notFound();
	return (
		<Placeholder
			route={`/research/${slug}`}
			title={article.title}
			milestone="M7"
		/>
	);
}
