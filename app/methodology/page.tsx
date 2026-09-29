import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = { title: "方法论" };

export default function MethodologyPage() {
	return <Placeholder route="/methodology" title="方法论" milestone="M6b" />;
}
