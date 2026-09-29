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

export const metadata: Metadata = {
	alternates: { languages: { "zh-CN": "/", en: "/en" } },
};

/** Section order and rationale: WEBSITE_PLAN §6.1 · copy: docs/copy/home.zh.md */
export default function HomePage() {
	return (
		<main id="main">
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
