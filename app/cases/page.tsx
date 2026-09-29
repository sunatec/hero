import { allCases } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "精选案例" };

export default function CasesPage() {
	return (
		<Placeholder route="/cases" title="精选案例" milestone="M6b">
			<p>精选 · 非完整记录</p>
			{allCases.map((c) => (
				<p key={c.slug}>
					<Link
						className="text-dossier hover:text-stamp"
						href={`/cases/${c.slug}`}
					>
						{c.date} {c.assets.join(" ")}
					</Link>
				</p>
			))}
		</Placeholder>
	);
}
