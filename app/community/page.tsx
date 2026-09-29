import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "社群介绍" };

export default function CommunityPage() {
	return <Placeholder route="/community" title="社群介绍" milestone="M7" />;
}
