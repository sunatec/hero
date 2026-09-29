import { allSignals } from "content-collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Placeholder } from "@/components/site/Placeholder";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
	return allSignals.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { id } = await params;
	return { title: id };
}

export default async function SignalPage({ params }: Props) {
	const { id } = await params;
	const signal = allSignals.find((s) => s.id === id);
	if (!signal) notFound();
	return (
		<Placeholder route={`/ledger/${id}`} title={id} milestone="M6a">
			<p>状态：{signal.status}</p>
			<p>模块：{signal.module}</p>
			{signal.status === "open" ? (
				<p>标的与价格：▇▇▇▇（成员可见）</p>
			) : signal.status === "void" ? (
				<p>作废：{signal.voidReason}</p>
			) : (
				<p>
					{signal.asset} · 结案收益 {signal.closedReturnPct}%
				</p>
			)}
		</Placeholder>
	);
}
