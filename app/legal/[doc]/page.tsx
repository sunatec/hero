import { MDXContent } from "@content-collections/mdx/react";
import { allLegals } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { label, wrap } from "@/lib/ui";
import { site } from "@/site.config";

type Props = { params: Promise<{ doc: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return allLegals.map((d) => ({ doc: d.slug }));
}

const find = (slug: string) => allLegals.find((d) => d.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const d = find((await params).doc);
	return d ? { title: d.title } : {};
}

const handle = (type: "telegram" | "x") =>
	site.officialChannels.find((c) => c.type === type)?.handle ?? "";

/** Handles come from site.config so the legal text never drifts from /verify. */
const components = {
	TgHandle: () => <b className="font-medium">{handle("telegram")}</b>,
	XHandle: () => <b className="font-medium">{handle("x")}</b>,
};

/** Article template for /legal/{risk,privacy,terms}. Copy source: docs/copy/legal.md. */
export default async function LegalPage({ params }: Props) {
	const d = find((await params).doc);
	if (!d) notFound();
	return (
		<main id="main" className={`${wrap} pt-11 pb-20 md:pt-18 md:pb-32`}>
			<article className="mx-auto max-w-[44em]">
				<p className={label}>Legal</p>
				<h1 className="mt-3 font-serif-zh text-[clamp(36px,5vw,56px)] leading-tight font-black tracking-[0.04em]">
					{d.title}
				</h1>
				<p className="mt-4 font-mono text-[13px] text-bone-dim">
					最后更新：{formatDate(d.updatedAt)}
				</p>
				<div className="mt-10 leading-[1.9] [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif-zh [&_h2]:text-xl [&_h2]:font-bold [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-medium [&_strong]:text-bone [&_ul]:list-disc [&_ul]:pl-5 [&_ol_li::marker]:font-mono [&_ol_li::marker]:text-dossier">
					<MDXContent code={d.mdx} components={components} />
				</div>
			</article>
		</main>
	);
}
