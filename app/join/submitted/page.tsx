import type { Metadata } from "next";
import { AgentPhoto } from "@/components/dossier/AgentPhoto";
import { Arrow, ButtonLink } from "@/components/site/Button";
import { agent } from "@/lib/content";
import { label, wrap } from "@/lib/ui";
import { site } from "@/site.config";

export const metadata: Metadata = {
	title: "申请已提交",
	robots: { index: false },
};

const tgHandle =
	site.officialChannels.find((c) => c.type === "telegram")?.handle ?? "";

/** Copy: docs/copy/join.md. The agent photo is the one emotional beat allowed here (§11.6). */
export default function SubmittedPage() {
	return (
		<main id="main" className={`${wrap} pt-12 pb-20 md:pt-20 md:pb-32`}>
			<div className="grid items-start gap-12 md:grid-cols-[1fr_auto] md:gap-20">
				<div className="max-w-[36em]">
					<p className={label}>Application received</p>
					<h1 className="mt-3 font-serif-zh text-[clamp(40px,6vw,72px)] leading-[1.1] font-black tracking-[0.04em]">
						申请已提交
					</h1>
					<p className="mt-6 text-lg leading-relaxed">
						管理员会在<span className="text-dossier">待补充</span>内通过{" "}
						<b className="font-medium">{tgHandle}</b>{" "}
						联系你。如果超时没有收到消息，可以主动私信这个账号。
					</p>

					<section
						aria-labelledby="before-pay"
						className="mt-10 rounded-file border border-stamp/60 bg-ink-1 p-6"
					>
						<h2 id="before-pay" className={`${label} mb-4 text-stamp`}>
							在付款之前
						</h2>
						<ul className="m-0 flex list-none flex-col gap-3 p-0 leading-relaxed">
							{[
								"我们只会用「官方渠道验证」页列出的账号联系你",
								"如果有人自称管理员主动私信你，请先核对账号的数字 ID",
								"管理员不会向你索要私钥、助记词、验证码或远程控制权限",
								site.paymentAddresses.length
									? "付款前请核对收款地址与官方渠道验证页公示的一致"
									: "付款前请再次核对联系你的账号",
							].map((t) => (
								<li key={t} className="flex gap-3">
									<span aria-hidden="true" className="font-mono text-dossier">
										—
									</span>
									{t}
								</li>
							))}
						</ul>
					</section>

					<div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
						<ButtonLink href="/verify">查看官方渠道</ButtonLink>
						<ButtonLink href="/" variant="link">
							返回首页 <Arrow />
						</ButtonLink>
					</div>
				</div>
				<AgentPhoto src={agent?.photo || undefined} size={200} />
			</div>
		</main>
	);
}
