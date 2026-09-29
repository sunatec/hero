import { site, TBD } from "@/site.config";

const startDate =
	site.ledgerStartDate === TBD ? "上线日" : site.ledgerStartDate;

/** Copy: docs/copy/global.md 「风险提示」. */
export const RISK_TEXT = {
	short:
		"本站内容仅用于研究与信息交流，不构成投资建议。加密资产价格波动剧烈，可能导致全部本金损失；台账与案例记录的是信号及其结案规则下的计算结果，不代表任何成员的实际收益，过往表现不代表未来结果。",
	ledger: `台账从 ${startDate} 起登记每一条信号，编号连续、不可删除。收益按结案规则计算，不含手续费与滑点，详见方法论。`,
	cases: `精选案例来自 ${startDate} 之前在 X 发布的复盘，收益为原帖所写的最大涨幅口径，未经统一核验，不计入台账统计。`,
	impersonation:
		"官方渠道仅限「官方渠道验证」页列出的账号。除了回复你的申请，管理员不会主动私信你。",
} as const;

export function RiskNote({
	variant = "short",
	className = "",
}: {
	variant?: keyof typeof RISK_TEXT;
	className?: string;
}) {
	return (
		<p
			role="note"
			className={`max-w-[60em] text-[13px] leading-relaxed text-bone-dim ${className}`}
		>
			{variant === "short" ? "风险披露：" : null}
			{RISK_TEXT[variant]}
		</p>
	);
}
