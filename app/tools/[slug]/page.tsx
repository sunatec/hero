import { allModules } from "content-collections";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return allModules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({ params }: Props) {
	const { slug } = await params;
	const mod = allModules.find((m) => m.slug === slug);
	if (!mod) notFound();
	return (
		<Placeholder route={`/tools/${slug}`} title={mod.nameZh} milestone="M8">
			<p className="font-data">
				{mod.code} / {mod.category} · {mod.tagline}
			</p>
		</Placeholder>
	);
}
