import type { Direction } from "@/lib/schema/common";
import type { SignalStatus } from "@/lib/schema/signal";

/** Display dictionary — docs/content-model.md §7. */
export const statusLabel: Record<SignalStatus, string> = {
	open: "进行中",
	hit: "命中",
	invalidated: "失效",
	stopped: "止损",
	expired: "超时",
	void: "作废",
};

export const directionLabel: Record<Direction, string> = {
	long: "做多",
	short: "做空",
	"risk-alert": "风险预警",
};

export type ModuleStatus = "member" | "beta" | "public" | "planned";
export const moduleStatusLabel: Record<ModuleStatus, string> = {
	member: "运行中",
	beta: "测试中",
	public: "公开",
	planned: "规划中",
};

export type ModuleCategory =
	| "derivatives"
	| "institutional"
	| "smart-money"
	| "onchain-behavior"
	| "custom"
	| "market";
export const categoryLabel: Record<
	ModuleCategory,
	{ zh: string; code: string }
> = {
	derivatives: { zh: "衍生品", code: "DERIVATIVES" },
	institutional: { zh: "机构资金", code: "INSTITUTIONAL" },
	"smart-money": { zh: "聪明钱", code: "SMART MONEY" },
	"onchain-behavior": { zh: "链上行为", code: "ON-CHAIN" },
	custom: { zh: "定制", code: "CUSTOM" },
	market: { zh: "市场", code: "MARKET" },
};

export const REDACT_TIP = "成员可见 · 申请加入 →";
export const REDACT_ARIA = "成员可见内容，已隐藏";

export const methodLabel: Record<string, string> = {
	"address-cluster": "地址集群",
	"onchain-anomaly": "链上异动",
	"smart-money": "聪明钱",
	"hype-monitor": "HYPE 监控",
	oi: "OI 异动",
	"coinbase-premium": "Coinbase 溢价",
	dca: "DCA",
	other: "其他",
};

export const caseResultLabel: Record<string, string> = {
	profit: "盈利",
	loss: "亏损",
	avoided: "规避下跌",
	unknown: "未结束",
};
