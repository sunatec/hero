import { allResearch } from "content-collections";
import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "Research" };

export default function ResearchIndexPage() {
	const published = allResearch.filter((r) => !r.draft);
	return (
		<Placeholder route="/research" title="Research" milestone="M7">
			{published.length === 0 ? <p>第一篇 Research 正在撰写。</p> : null}
		</Placeholder>
	);
}
