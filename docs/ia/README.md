# 信息架构 v1（M2）

> 本目录：`README.md`（站点地图、导航、全局规则）· `wireframes.md`（逐路由线框）
> 文案在 `docs/copy/`，内容模型在 `docs/content-model.md`，占位符汇总在 `docs/open-items.md`

## 1. 站点地图与页面模板

| 路由 | 页面 | 模板 | 数据来源 | 在导航中 | 索引 |
|---|---|---|---|---|---|
| `/` | 首页 | Home | ledger · cases(featured) · modules · research · site | — | ✓ |
| `/ledger` | 信号台账 | Index-Dossier | ledger | 社群战绩 | ✓ |
| `/ledger/[id]` | 档案详情 | Detail-Dossier | ledger | — | ✓ |
| `/cases` | 精选案例 | Index-Dossier | cases | 台账页 Tab | ✓ |
| `/cases/[slug]` | 案例详情 | Detail-Dossier | cases | — | ✓ |
| `/methodology` | 方法论 | Article | pages | 台账页 Tab | ✓ |
| `/tools` | 链上工具箱 | Index-Pane | modules · ledger(计数) | 链上工具箱 | ✓ |
| `/tools/[slug]` | 模块详情 | Detail-Pane | modules · ledger | — | ✓ |
| `/community` | 社群介绍 | Article | pages · modules · site | 社群介绍 | ✓ |
| `/about` | 主理人档案 | Article | agent · site | footer | ✓ |
| `/research` | Research | Index-Dossier | research | footer · 首页 | ✓ |
| `/research/[slug]` | 文章 | Article | research | — | ✓ |
| `/join` | 申请加入 | Form | site | **主 CTA** | ✓ |
| `/join/submitted` | 提交成功 | Status | site | — | ✗ |
| `/verify` | 官方渠道验证 | Article | site | footer · 提交成功页 | ✓ |
| `/legal/risk` `/legal/privacy` `/legal/terms` | 法律 | Article | pages | footer | ✓ |
| `/en` `/en/about` | English | Home-EN / Article | pages | 语言切换 | ✓ |
| `404` | 未找到 | Status | — | — | ✗ |

**「社群战绩」的内部结构**：`/ledger`、`/cases`、`/methodology` 三页共用一条二级 Tab：`台账 · 精选案例 · 方法论`。导航上的「社群战绩」在这三页都显示为当前项。

**模板**（M4 实现为布局组件）：

- **Home**：只用于首页
- **Index-Dossier**：页头（标签、H1、引言、右侧元信息）+ 可选的二级 Tab + 统计条 + 筛选 + 列表 + 风险提示
- **Detail-Dossier**：批注栏 + 档案主体 + 底部品牌区块 + CTA + 上一份 / 下一份
- **Index-Pane / Detail-Pane**：工具箱的 A 窗格系统（点阵背景、窗格网格）
- **Article**：批注栏 + 68ch 正文 + 目录（长文才出现）
- **Form**：左侧说明，右侧表单
- **Status**：居中短文案 + 柴犬探员 + 下一步链接

## 2. 导航

**桌面顶栏**（高 68px，吸顶）

```
[0xInChain | 链上情报局]          社群战绩  链上工具箱  社群介绍  X ↗        [申请加入]
```

- 当前页面：导航项下方显示 1px 印章红下划线，并加 `aria-current="page"`
- 「X ↗」在新窗口打开，链接带 `rel="noopener noreferrer"`，文字颜色用 bone-dim
- `/join` 页顶栏的「申请加入」按钮隐藏（避免指向当前页）

**移动端**（≤ 760px）

- 顶栏：字标（不显示中文名）+ 小号「申请加入」+「菜单」按钮（44×44）
- 菜单：从右侧滑出的全屏抽屉，内容依次为：
  1. 社群战绩 / 链上工具箱 / 社群介绍（衬线大字）
  2. 主理人档案 · Research · 官方渠道验证
  3. X ↗ · Telegram ↗
  4. 语言切换：中文 / EN
  5. 底部：「申请加入」全宽按钮
- 吸底条：页面滚动超过一屏后出现，内容为「{batch.name} · 每日审核 {reviewPerDay} 位」加「申请加入 →」。在 `/join`、`/join/submitted`、`/legal/*` 页面不显示

**Footer**（全站相同）

```
[字标]  链上情报局 · On-chain Intelligence Bureau
┌ 情报            ┌ 社群              ┌ 信任                ┌ 关注
│ 信号台账        │ 社群介绍          │ 官方渠道验证        │ X ↗
│ 精选案例        │ 主理人档案        │ 方法论              │ Telegram ↗
│ 方法论          │ 申请加入          │ 风险披露            │
│ 链上工具箱      │ Research          │ 隐私 · 条款         │ 中文 / EN
─────────────────────────────────────────────────────────────
风险提示（2 行，见 docs/copy/global.md）
官方渠道仅限 /verify 列出的账号。除了回复你的申请，管理员不会主动私信你。
台账最后更新：{date} (UTC+8) · © 2026 0xInChain
```

## 3. 全局规则

| 规则 | 说明 |
|---|---|
| **页头结构** | 每页都有：label（小号大写，卷宗黄）→ H1（衬线）→ 引言（≤ 2 行）。例如「社群战绩 · Signal Ledger / 信号台账」 |
| **区块编号** | 首页区块编号为 `§ 01–§ 12`；子页从 `§ 01` 重新编号 |
| **风险提示** | 这些页面底部必须有：`/ledger*` `/cases*` `/tools*` `/join` 及首页的加入区块。文案统一取自 `global.md` |
| **更新时间** | 台账相关页面的页头右侧显示「最后更新」时间，取构建时间 |
| **空状态** | 台账没有数据时显示：柴犬探员 +「今天还没有新的立案。」；筛选无结果时显示：「没有符合条件的档案」+「清除筛选」 |
| **外链** | 全部新窗口打开，带 `↗`，并加 `rel="noopener noreferrer"`；只允许链接到 `officialChannels`、X 推文、区块链浏览器 |
| **CTA 规则** | 每屏最多一个印章红实心按钮；其他 CTA 用下划线文字链 |
| **深链落地** | `/ledger/[id]` 和 `/cases/[slug]` 底部必须有品牌区块：「这是 0xInChain 台账中的第 N 份档案」+ 一句定位 +「查看台账」和「申请加入」 |

## 4. 首次访问者的主路径（验证 IA 用）

| 入口 | 路径 | 期望的终点 |
|---|---|---|
| X 复盘推文 | `/ledger/[id]` → 品牌区块 → `/ledger` → `/join` | 申请 |
| X 主页 bio / Linktree | `/` → 证据条 → `/ledger` → 首页的加入区块 | 申请 |
| 口碑 / 搜索 | `/` →「我们盯什么」→ `/tools/[slug]` → 涂黑样本 → `/join` | 申请 |
| 已有成员 | footer → `/verify` | 核对账号 |
| 英文访客 | `/en` → Follow on X | 关注 |
