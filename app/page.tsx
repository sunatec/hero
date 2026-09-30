import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { Proof } from "@/components/home/Proof";
import {
	AgentFile,
	FeaturedCases,
	FitCheck,
	HowItWorks,
	IntelSample,
	JoinSection,
	LatestLedger,
	LatestResearch,
	Monitor,
	ToolboxPreview,
} from "@/components/home/Sections";
import { JsonLd } from "@/components/site/JsonLd";
import { organizationLd, websiteLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = pageMeta({
	title: `${site.name} ${site.nameZh} · 可复盘的链上情报`,
	absoluteTitle: true,
	description:
		"面向中文实战交易者的链上情报局：自研监控捕捉聪明钱、巨鲸与衍生品资金异动，并用公开台账记录每一条信号的立案与结案。",
	path: "/",
	languages: { "zh-CN": "/", en: "/en" },
});

/** Section order and rationale: WEBSITE_PLAN §6.1 · copy: docs/copy/home.zh.md */
export default function HomePage() {
	return (
		<main id="main">
			<JsonLd data={[organizationLd(), websiteLd()]} />
			<Hero />
			<Proof />
			<Monitor />
			<LatestLedger />
			<HowItWorks />
			<IntelSample />
			<ToolboxPreview />
			<FeaturedCases />
			<AgentFile />
			<FitCheck />
			<JoinSection />
			<LatestResearch />
		</main>
	);
}
