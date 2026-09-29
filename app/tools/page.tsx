import { allModules } from "content-collections";
import type { Metadata } from "next";
import Link from "next/link";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "链上工具箱" };

export default function ToolsPage() {
	const modules = [...allModules].sort((a, b) => a.order - b.order);
	return (
		<Placeholder route="/tools" title="链上工具箱" milestone="M8">
			{modules.map((m) => (
				<p key={m.slug} className="font-data">
					<Link
						className="text-dossier underline underline-offset-4 hover:text-stamp"
						href={`/tools/${m.slug}`}
					>
						{m.code}
					</Link>{" "}
					· {m.nameZh} · {m.status}
				</p>
			))}
		</Placeholder>
	);
}
