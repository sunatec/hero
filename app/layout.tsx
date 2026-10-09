import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RedactionTips } from "@/components/dossier/RedactionTips";
import { Analytics } from "@/components/site/Analytics";
import { Footer } from "@/components/site/Footer";
import { Masthead } from "@/components/site/Masthead";
import { Motion } from "@/components/site/Motion";
import { StickyApply } from "@/components/site/StickyApply";
import { latin, plexMono, serifZh } from "@/lib/fonts";
import { site } from "@/site.config";
import "./globals.css";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: `${site.name} ${site.nameZh} · 可复盘的链上情报`,
		template: `%s · ${site.name} ${site.nameZh}`,
	},
	description:
		"面向中文实战交易者的链上情报局：自研监控捕捉聪明钱、巨鲸与衍生品资金异动，并用公开台账记录每一条信号的立案与结案。",
	icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="zh-CN"
			className={`${serifZh.variable} ${latin.variable} ${plexMono.variable}`}
		>
			<body>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ink-2 focus:px-4 focus:py-2"
				>
					跳到主要内容
				</a>
				<Masthead />
				{children}
				<Footer />
				<StickyApply />
				<RedactionTips />
				<Motion />
				<Analytics />
			</body>
		</html>
	);
}
