import type { Metadata } from "next";
import { PageHeader } from "@/components/site/PageHeader";
import { pageMeta } from "@/lib/seo";
import { label, wrap } from "@/lib/ui";
import { site, TBD } from "@/site.config";

const INTRO =
	"冒充管理员是加密社群里最常见的骗局。0xInChain 只使用下面列出的账号。与你联系的账号只要不在这张表里，无论名字和头像多像，都不是我们。";

export const metadata: Metadata = pageMeta({
	title: "官方渠道验证",
	description: INTRO,
	path: "/verify",
});

const pending = <span className="text-dossier">待补充</span>;
const x = site.officialChannels.find((c) => c.type === "x");
const tg = site.officialChannels.find((c) => c.type === "telegram");

/** Copy: docs/copy/join.md 「/verify」. Everything renders from site.config.officialChannels. */
export default function VerifyPage() {
	return (
		<main id="main">
			<PageHeader
				kicker="官方渠道验证 · Verify"
				title="只认这些账号"
				intro={INTRO}
			/>
			<div className={`${wrap} flex flex-col gap-16 pb-20 md:pb-32`}>
				<section aria-label="官方账号">
					<table className="w-full border-collapse text-left text-[15px] max-md:block">
						<caption className="sr-only">官方账号</caption>
						<thead className="max-md:hidden">
							<tr className="border-b border-line font-mono text-[11px] tracking-[0.14em] text-dossier">
								<th scope="col" className="px-3 py-3.5 font-medium">
									平台
								</th>
								<th scope="col" className="px-3 py-3.5 font-medium">
									账号
								</th>
								<th scope="col" className="px-3 py-3.5 font-medium">
									数字 ID
								</th>
								<th scope="col" className="px-3 py-3.5 font-medium">
									用途
								</th>
							</tr>
						</thead>
						<tbody className="max-md:block">
							{site.officialChannels.map((c) => (
								<tr
									key={c.handle}
									className="border-b border-line max-md:grid max-md:grid-cols-[6em_1fr] max-md:gap-y-1 max-md:py-4"
								>
									<td className="px-3 py-5 max-md:p-0 max-md:text-bone-dim">
										{c.type === "x" ? "X" : "Telegram"}
									</td>
									<td className="px-3 py-5 font-mono text-lg max-md:p-0">
										{c.handle}
									</td>
									<td className="px-3 py-5 font-mono max-md:col-start-2 max-md:p-0">
										<span className="md:hidden text-bone-dim">ID </span>
										{c.numericId === TBD ? pending : c.numericId}
									</td>
									<td className="px-3 py-5 text-bone-dim max-md:col-start-2 max-md:p-0">
										{c.role}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>

				{site.paymentAddresses.length ? (
					<section aria-labelledby="pay-h">
						<h2 id="pay-h" className={`${label} mb-4`}>
							官方收款地址
						</h2>
						<ul className="m-0 list-none p-0 font-mono">
							{site.paymentAddresses.map((a) => (
								<li
									key={a.address}
									className="border-b border-line py-4 break-all"
								>
									<span className="mr-4 text-dossier">{a.chain}</span>
									{a.address}
								</li>
							))}
						</ul>
					</section>
				) : null}

				<section aria-labelledby="rules-h" className="max-w-[44em]">
					<h2 id="rules-h" className={`${label} mb-5`}>
						规则
					</h2>
					<ol className="m-0 flex list-none flex-col gap-4 p-0 text-[17px] leading-relaxed">
						{[
							<>
								除了回复你提交的申请，管理员
								<b className="font-medium text-stamp">不会主动私信</b>你。
							</>,
							<>
								管理员<b className="font-medium text-stamp">不会索要</b>
								私钥、助记词、验证码，也不会要求远程控制你的设备。
							</>,
							<>
								我们<b className="font-medium text-stamp">不会</b>
								在成员群以外的地方收款，也不会临时更换收款地址。
							</>,
							<>
								我们<b className="font-medium text-stamp">没有</b>其他 X
								账号、小号或“助理”账号。
							</>,
						].map((r, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: static list
							<li key={i} className="grid grid-cols-[2em_1fr]">
								<span className="font-mono text-dossier">{i + 1}.</span>
								<span>{r}</span>
							</li>
						))}
					</ol>
				</section>

				<section
					aria-labelledby="report-h"
					className="max-w-[44em] rounded-file border border-line bg-ink-1 p-6"
				>
					<h2 id="report-h" className={`${label} mb-3`}>
						发现冒充
					</h2>
					<p className="m-0 leading-relaxed">
						请截图冒充账号的主页，私信{" "}
						<b className="font-medium">{x?.handle}</b> 或{" "}
						<b className="font-medium">{tg?.handle}</b>。我们会在 X 上公开提醒。
					</p>
				</section>

				<p className="m-0 font-mono text-[13px] text-bone-dim">
					最后核对：{pending}
				</p>
			</div>
		</main>
	);
}
