# 全局文案 v1（M2）

> 规范：`docs/brand.md` 第 3 节。`{}` 表示变量，`【待确认：…】` 表示占位符（汇总在 `docs/open-items.md`）。

## 导航

| 键 | 中文 | English |
|---|---|---|
| nav.ledger | 社群战绩 | Ledger |
| nav.tools | 链上工具箱 | Toolbox |
| nav.community | 社群介绍 | The Room |
| nav.x | X ↗ | X ↗ |
| nav.apply | 申请加入 | Follow on X（英文站不提供申请入口） |
| nav.menu | 菜单 | Menu |
| nav.close | 关闭 | Close |
| tabs.ledger | 台账 · 精选案例 · 方法论 | — |
| sticky.apply | {batch.name} · 每日审核 {reviewPerDay} 位　申请加入 → | — |

## 通用 CTA

| 键 | 文案 |
|---|---|
| cta.apply | 申请加入 |
| cta.apply.waitlist | 提交候补申请 |
| cta.ledger | 查看信号台账 |
| cta.ledger.full | 完整台账（{n} 份） |
| cta.methodology | 阅读方法论 |
| cta.tools | 进入链上工具箱 |
| cta.cases | 全部精选案例 |
| cta.verify | 查看官方渠道 |
| cta.agent | 完整档案 |
| cta.followX | 在 X 关注 |
| cta.back | ← 返回 |
| cta.detail | 详情 |
| cta.open | 打开工具 |
| redact.tip | 成员可见 · 申请加入 → |
| redact.aria | 成员可见内容，已隐藏 |

## 风险提示

**短版**（footer，以及台账、工具箱、加入页的底部）

> 本站内容仅用于研究与信息交流，不构成投资建议。加密资产价格波动剧烈，可能导致全部本金损失；台账与案例记录的是信号及其结案规则下的计算结果，不代表任何成员的实际收益，过往表现不代表未来结果。

**台账专用**

> 台账从 {ledgerStartDate} 起登记每一条信号，编号连续、不可删除。收益按结案规则计算，不含手续费与滑点，详见方法论。

**案例专用**

> 精选案例来自 {ledgerStartDate} 之前在 X 发布的复盘，收益为原帖所写的最大涨幅口径，未经统一核验，不计入台账统计。

**防冒充**（footer 第二行）

> 官方渠道仅限「官方渠道验证」页列出的账号。除了回复你的申请，管理员不会主动私信你。

## Footer

| 键 | 文案 |
|---|---|
| footer.tagline | 链上情报局 · On-chain Intelligence Bureau |
| footer.col.intel | 情报：信号台账 · 精选案例 · 方法论 · 链上工具箱 |
| footer.col.room | 社群：社群介绍 · 主理人档案 · 申请加入 · Research |
| footer.col.trust | 信任：官方渠道验证 · 方法论 · 风险披露 · 隐私 · 条款 |
| footer.col.follow | 关注：X ↗ · Telegram ↗ · 中文 / EN |
| footer.updated | 台账最后更新：{date} (UTC+8) |
| footer.copy | © 2026 0xInChain |

## 状态与空状态

| 键 | 文案 |
|---|---|
| empty.ledger | 今天还没有新的立案。 |
| empty.filter | 没有符合条件的档案。　清除筛选 |
| empty.research | 第一篇 Research 正在撰写。 |
| badge.late | 延迟登记（立案后 {h} 小时登记） |
| badge.unverified | 未核验 |
| badge.curated | 精选 · 非完整记录 |
| open.note | 立案即登记，结案后 24 小时内公开全部字段。成员已于 {openedAt} 在 TG 收到完整信号。 |
| brand.block | 这是 0xInChain 台账中的第 {n} 份档案。我们为每一条信号公开登记、按规则结案，失败的也一样。 |
| 404.title | 这份档案不存在，或已被归档。 |
| 404.links | ← 返回首页 · 查看信号台账 → |

## SEO 元信息

| 页面 | title | description |
|---|---|---|
| 模板 | {page} · 0xInChain 链上情报局 | — |
| `/` | 0xInChain 链上情报局 · 可复盘的链上情报 | 面向中文实战交易者的链上情报局：自研监控捕捉聪明钱、巨鲸与衍生品资金异动，并用公开台账记录每一条信号的立案与结案。 |
| `/ledger` | 信号台账 | 自 {ledgerStartDate} 起的每一条信号：立案即登记，结案即公开，命中、失效、止损同样记录。 |
| `/ledger/[id]` | {id} · {asset 或 "进行中档案"} {direction} | {module} 模块于 {openedAt} 立案，状态：{status}{，结案收益 {closedReturnPct}}。 |
| `/cases` | 精选案例 | 0xInChain 在 X 发布的历史复盘精选。精选、非完整记录，不计入台账统计。 |
| `/methodology` | 方法论 | 台账如何登记、何时结案、收益怎么算、为什么失败也要公开。 |
| `/tools` | 链上工具箱 | 8 个自研链上监控模块：OI 异动、Coinbase 溢价、四链聪明钱、Hyperliquid 大单等。 |
| `/tools/[slug]` | {nameZh} | {tagline} |
| `/community` | 社群介绍 | 一个只服务中文实战交易者的付费链上情报室：你会得到什么、如何交付、适合谁。 |
| `/about` | 主理人档案 | 谁在负责链上情报局，以及为什么要公开每一条信号。 |
| `/join` | 申请加入 | 申请制，审核通过后由官方管理员联系。参考价、流程与规则。 |
| `/verify` | 官方渠道验证 | 0xInChain 只使用这些账号。付款前请在此核对。 |
| `/en` | 0xInChain · On-chain Intelligence Bureau | An on-chain intelligence bureau for traders — we track where capital moves, and keep a public ledger of every call. |
