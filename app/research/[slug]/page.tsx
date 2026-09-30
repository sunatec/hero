import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/site/Button";
import { RiskNote } from "@/components/site/RiskNote";
import { moduleBySlug, research } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { label, wrap } from "@/lib/ui";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	const slugs = research.map((r) => ({ slug: r.slug }));
	// Static export needs at least one param when dynamicParams is false; the sentinel renders a 404.
	return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
}

const find = (slug: string) => research.find((r) => r.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const r = find((await params).slug);
	return r ? { title: r.title, description: r.summary } : {};
}

/** Article template (docs/ia/wireframes.md). Body is MDX; related files and modules close the article. */
export default async function ResearchPage({ params }: Props) {
	const r = find((await params).slug);
	if (!r) notFound();
	const modules = r.relatedModules
		.map((m) => moduleBySlug(m))
		.filter((m) => m !== null);
	return (
		<main id="main" className={`${wrap} pt-10 md:pt-14`}>
			<nav aria-label="文章导航" className="mb-10 font-mono text-[13px]">
				<Link
					href="/research"
					className="text-bone tap underline underline-offset-4 hover:text-stamp"
				>
					← Research
				</Link>
			</nav>
			<article className="mx-auto max-w-[44em]">
				<p className={label}>
					Research{r.tags.length ? ` · ${r.tags.join(" · ")}` : ""}
				</p>
				<h1 className="mt-3 font-serif-zh text-[clamp(32px,5vw,52px)] leading-tight font-black">
					{r.title}
				</h1>
				<p className="mt-4 font-mono text-[13px] text-bone-dim">
					发布 {formatDate(r.publishedAt)}
					{r.updatedAt ? ` · 更新 ${formatDate(r.updatedAt)}` : ""}
				</p>
				<p className="mt-6 text-lg leading-relaxed text-bone-dim">
					{r.summary}
				</p>
				<div className="mt-10 space-y-5 leading-[1.9] [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-12 [&_h2]:font-serif-zh [&_h2]:text-2xl [&_h2]:font-bold [&_strong]:font-medium">
					<MDXContent code={r.mdx} />
				</div>
				{r.relatedSignals.length || modules.length ? (
					<aside className="mt-14 border-t border-line pt-6 font-mono text-[13px]">
						{r.relatedSignals.length ? (
							<p>
								相关档案：
								{r.relatedSignals.map((id) => (
									<Link
										key={id}
										href={`/ledger/${id}`}
										className="ml-3 text-bone tap underline underline-offset-4"
									>
										{id}
									</Link>
								))}
							</p>
						) : null}
						{modules.length ? (
							<p className="mt-2">
								相关模块：
								{modules.map((m) => (
									<Link
										key={m.slug}
										href={`/tools/${m.slug}`}
										className="ml-3 text-bone tap underline underline-offset-4"
									>
										{m.code} {m.nameZh} <Arrow />
									</Link>
								))}
							</p>
						) : null}
					</aside>
				) : null}
				<RiskNote className="mt-12" />
			</article>
		</main>
	);
}
