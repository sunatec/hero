import type { Metadata } from "next";
import type { ReactNode } from "react";
import { latin, plexMono, sansZh, serifZh } from "@/lib/fonts";
import { site } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = {
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
			className={`${serifZh.variable} ${sansZh.variable} ${latin.variable} ${plexMono.variable}`}
		>
			<body>{children}</body>
		</html>
	);
}
