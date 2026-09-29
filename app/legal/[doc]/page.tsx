import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";

const DOCS = {
	risk: "风险披露",
	privacy: "隐私说明",
	terms: "服务条款",
} as const;
type Doc = keyof typeof DOCS;
type Props = { params: Promise<{ doc: string }> };

const isDoc = (d: string): d is Doc => d in DOCS;

export const dynamicParams = false;

export function generateStaticParams() {
	return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { doc } = await params;
	return { title: isDoc(doc) ? DOCS[doc] : undefined };
}

export default async function LegalPage({ params }: Props) {
	const { doc } = await params;
	if (!isDoc(doc)) notFound();
	return (
		<Placeholder route={`/legal/${doc}`} title={DOCS[doc]} milestone="M9" />
	);
}
