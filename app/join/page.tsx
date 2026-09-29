import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";
import { site } from "@/site.config";

export const metadata: Metadata = { title: "申请加入" };

export default function JoinPage() {
	return (
		<Placeholder route="/join" title="申请加入" milestone="M9">
			<p>
				{site.batch.name} · {site.batch.seats} 席 · 每日审核{" "}
				{site.batch.reviewPerDay} 位
			</p>
		</Placeholder>
	);
}
