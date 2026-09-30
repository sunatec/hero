import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/PageHeader";
import { research } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { wrap } from "@/lib/ui";

export const metadata: Metadata = pageMeta({
	title: "Research",
	description: "对一个标的、一类资金行为或一个模块的深入拆解。每月 1–2 篇。",
	path: "/research",
});

export default function ResearchIndexPage() {
	return (
		<main id="main">
			<PageHeader
				kicker="Research"
				title="Research"
				intro="对一个标的、一类资金行为或一个模块的深入拆解。每月 1–2 篇。"
			/>
			<section className={wrap} aria-label="文章列表">
				{research.length === 0 ? (
					<p className="border-y border-line py-12 text-center text-bone-dim">
						第一篇 Research 正在撰写。
					</p>
				) : (
					<ol className="m-0 list-none border-t border-line p-0">
						{research.map((r, i) => (
							<li key={r.slug} className="border-b border-line">
								<Link
									href={`/research/${r.slug}`}
									className="grid gap-2 py-6 hover:text-stamp md:grid-cols-[3em_1fr_auto] md:items-baseline md:gap-4"
								>
									<span className="font-mono text-dossier">
										{String(research.length - i).padStart(2, "0")}
									</span>
									<span>
										<span className="block font-serif-zh text-xl font-bold">
											{r.title}
										</span>
										<span className="mt-1 block text-sm text-bone-dim">
											{r.summary}
										</span>
									</span>
									<span className="font-mono text-[13px] text-bone-dim">
										{formatDate(r.publishedAt)}
										{r.tags.length ? ` · ${r.tags.join(" · ")}` : ""}
									</span>
								</Link>
							</li>
						))}
					</ol>
				)}
			</section>
		</main>
	);
}
