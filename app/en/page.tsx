import type { Metadata } from "next";
import { Placeholder } from "@/components/site/Placeholder";

export const metadata: Metadata = {
	title: { absolute: "0xInChain · On-chain Intelligence Bureau" },
	alternates: { languages: { "zh-CN": "/", en: "/en" } },
};

export default function EnHomePage() {
	return <Placeholder route="/en" title="0xInChain" milestone="M7" />;
}
