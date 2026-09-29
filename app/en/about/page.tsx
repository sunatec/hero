import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = {
	title: "Agent file",
	alternates: { languages: { "zh-CN": "/about", en: "/en/about" } },
};

export default function EnAboutPage() {
	return (
		<Placeholder route="/en/about" title="Who runs the bureau" milestone="M7" />
	);
}
