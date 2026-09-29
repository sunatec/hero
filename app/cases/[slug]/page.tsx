import { allCases } from "content-collections";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return allCases.map((c) => ({ slug: c.slug }));
}

export default async function CasePage({ params }: Props) {
	const { slug } = await params;
	const item = allCases.find((c) => c.slug === slug);
	if (!item) notFound();
	return (
		<Placeholder
			route={`/cases/${slug}`}
			title={item.assets.join(" ")}
			milestone="M6b"
		>
			<p>「{item.titleOriginal}」</p>
		</Placeholder>
	);
}
