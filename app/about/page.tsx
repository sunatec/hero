import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "主理人档案" };

export default function AboutPage() {
	return <Placeholder route="/about" title="主理人档案" milestone="M7" />;
}
