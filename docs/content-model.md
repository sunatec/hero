# 内容模型 v1（M2 定稿）

> M3 按本文件实现 `lib/schema/*.ts`（Zod）。本文件是唯一的真相源；实现和本文件不一致时，以本文件为准，或者先改本文件。
> 相对 WEBSITE_PLAN 第 14 节的变化，在各节末尾的「变更」里标出。

## 0. 通用约定

- 时间：ISO 8601，必须带时区，统一用 `+08:00`，例如 `2026-10-14T10:02:00+08:00`
- 金额和价格：`number`，不带单位；币种单位由 `quoteAsset` 字段说明（默认 `USDT`）
- 百分比：`number`，单位是 %，保留 1 位小数，正负号表示方向，例如 `18.4` 表示 +18.4%、`-8` 表示 −8.0%
- 标的：写成 `$` 加全大写代码的形式，例如 `$HYPE`；中文代币名保持原文，例如 `$龙虾`
- 文件名：`kebab-case`；台账文件名等于编号
- 所有枚举值用英文，界面显示时通过字典翻译成中文（见第 7 节）

---

## 1. Signal（台账档案）

**路径**：`content/ledger/{YYYY}/{id}.mdx`，例如 `content/ledger/2026/IC-2026-0001.mdx`

```ts
const Id = z.string().regex(/^IC-\d{4}-\d{4}$/);
const Status = z.enum(['open', 'hit', 'invalidated', 'stopped', 'expired', 'void']);
const Direction = z.enum(['long', 'short', 'risk-alert']);
const Chain = z.enum(['eth', 'bsc', 'base', 'sol', 'hyperliquid', 'cex', 'other']);

const Evidence = z.object({
  type: z.enum(['tg', 'tx', 'address', 'chart', 'x']),
  url: z.string().url().optional(),
  image: z.string().optional(),          // content/assets/ledger/{id}/xxx.webp
  note: z.string().max(120).optional(),
  capturedAt: z.string().datetime({ offset: true }).optional(),
}).refine(e => e.url || e.image, '证据至少需要 url 或 image');

const ChangelogEntry = z.object({
  at: z.string().datetime({ offset: true }),
  note: z.string().min(4),               // 必须说明改了什么、为什么
});

/** 立案时公开的字段（status = open 时只允许出现这些字段） */
const SignalPublic = z.object({
  id: Id,
  openedAt: z.string().datetime({ offset: true }),     // TG 推送时间
  registeredAt: z.string().datetime({ offset: true }), // 登记到台账的时间
  module: ModuleSlug,                                  // 见第 3 节
  direction: Direction,
  chains: z.array(Chain).min(1),
  status: Status,
  changelog: z.array(ChangelogEntry).default([]),
  commitHash: z.string().regex(/^[a-f0-9]{64}$/).optional(), // 后续增量：SHA-256 承诺
}).strict();

/** 结案后补全的字段 */
const SignalClosed = SignalPublic.extend({
  asset: z.string().regex(/^\$\S+$/),
  quoteAsset: z.string().default('USDT'),
  entryPrice: z.number().positive(),
  targets: z.array(z.number().positive()).optional(),
  stopLoss: z.number().positive().optional(),
  invalidation: z.string().optional(),               // 失效条件（文字）
  maxHoldingDays: z.number().int().positive().default(30),
  closedAt: z.string().datetime({ offset: true }),
  exitPrice: z.number().positive(),
  mfePct: z.number(),                                 // 最大有利偏移
  maePct: z.number(),                                 // 最大不利偏移（≤ 0）
  closedReturnPct: z.number(),                        // 按方向计算的结案收益
  evidence: z.array(Evidence).min(1),
  xUrl: z.string().url().optional(),                  // 对应的 X 复盘推文
  series: z.object({                                   // A7（M6a）：结案脚本拉取的行情
    source: z.string(),                                // 例如 binance:ARBUSDT
    interval: z.enum(['15m', '1h', '4h', '1d']),
    start: DateTime,                                   // = openedAt
    prices: z.array(z.number().positive()).min(2).max(400), // 收盘价
  }).optional(),
  voidReason: z.string().optional(),
}).strict();

export const Signal = z.discriminatedUnion('status', [
  SignalPublic.extend({ status: z.literal('open') }),
  ...(['hit', 'invalidated', 'stopped', 'expired', 'void'] as const)
    .map(s => SignalClosed.extend({ status: z.literal(s) })),
]);
```

**MDX 正文**：只在结案后填写，内容是 Thesis（入场依据）和复盘。open 状态的档案**正文必须为空**，由 M3 的校验脚本检查。

**跨字段校验**（写在 `superRefine` 或 `content:validate` 脚本里）：

| 规则 | 失败时 |
|---|---|
| `registeredAt - openedAt ≤ 2h` | 警告（不阻断构建），并在档案页显示「延迟登记」标记 |
| `closedAt > openedAt` | 构建失败 |
| `mfePct ≥ closedReturnPct ≥ maePct` | 构建失败（M1 视觉稿里就出现过这种错误） |
| `maePct ≤ 0 ≤ mfePct` | 构建失败 |
| `status = void` 时必须有 `voidReason` | 构建失败 |
| 编号在同一年内连续，没有缺号 | 构建失败（被作废的编号仍然占位） |
| 编号顺序与登记时间一致（编号大的不能登记得更早） | 构建失败（M5 新增） |
| `status = open` 时正文为空 | 构建失败 |
| 已结案档案的正文包含 `【待填写】` | 开发环境警告，严格模式（生产）构建失败（M6a 新增） |
| 已结案档案没有正文 | 警告 |
| `id` 与文件名一致 | 构建失败 |

**收益计算**（`lib/ledger/returns.ts`，必须有单元测试）：

```
long:        closedReturnPct = (exitPrice - entryPrice) / entryPrice × 100
short:       closedReturnPct = (entryPrice - exitPrice) / entryPrice × 100
risk-alert:  closedReturnPct = (entryPrice - exitPrice) / entryPrice × 100
             （预警时的价格作为 entryPrice，结案价取预警后 maxHoldingDays 内的收盘价；
               含义是「按预警离场，避开了多少跌幅」。方法论页必须写明这一点）
MFE / MAE：持有期内相对入场价，最有利和最不利的价格偏移（按方向取号）
```

**变更**：新增 `quoteAsset`、`maxHoldingDays`、`xUrl`、`Evidence.capturedAt`，以及方向 `risk-alert` 的收益口径；Chain 枚举新增 `other`；把收益区间一致性（MFE ≥ 结案收益 ≥ MAE）列为硬性校验。

**M3 实现时的细化**（`lib/schema/signal.ts`、`lib/ledger/rules.ts`）：
- 作废（`void`）是独立的第三种变体：必须有 `voidReason`，成员字段全部可选（登记错误的档案可能没有价格数据）
- 新增校验：`closedReturnPct` 必须与 `entryPrice`、`exitPrice`、`direction` 算出的结果一致（容差 0.1）
- 所有内容类型新增可选字段 `demo: true`，用来标记示例内容；严格模式下构建会拒绝
- 时间字段必须是字符串：YAML 中不加引号的时间会被解析成日期对象，校验会失败

---

## 2. CaseStudy（精选案例）

**路径**：`content/cases/{slug}.mdx`，slug 格式为 `{YYYY-MM-DD}-{asset}`，例如 `2026-06-02-h`

```ts
export const CaseStudy = z.object({
  slug: z.string(),
  date: z.string().date(),                        // 原推日期（由推文 ID 解码得到）
  assets: z.array(z.string().regex(/^\$\S+$/)).min(1),
  direction: Direction,
  method: z.enum(['address-cluster', 'onchain-anomaly', 'smart-money', 'hype-monitor',
                  'oi', 'coinbase-premium', 'dca', 'other']),
  module: ModuleSlug.optional(),
  result: z.enum(['profit', 'loss', 'avoided', 'unknown']),
  claim: z.object({
    metric: z.literal('max-return'),              // 历史案例一律按最大涨幅口径标注
    value: z.string().optional(),                 // 原文写法："+274%" / "6X" / "翻倍"
  }).optional(),
  titleOriginal: z.string(),                      // Notion 原标题，保留作为出处
  summary: z.string().max(80).optional(),         // 一句话逻辑，迁移时补写
  xUrl: z.string().url(),
  curated: z.literal(true),                       // 永远为 true，界面据此显示「精选」
  verified: z.boolean().default(false),           // 是否已人工核对原推
  featured: z.boolean().default(false),           // 是否出现在首页精选区
});
```

**规则**
- 案例**永远不参与**台账统计（`lib/ledger/stats.ts` 只读取 `content/ledger`，并用测试断言这一点）
- `verified: false` 的案例可以上线，但卡片上显示「未核验」标记
- 首页 `featured` 最多 3 条，其中**至少 1 条是做空或风险预警**（构建时校验）
- 数据源：`docs/migration/cases.csv`（M2 产出，共 55 条案例）

**变更**：新增 `result`、`verified`、`featured`、`titleOriginal`；把 `metric` 和 `value` 收进 `claim` 字段里，原文写法原样保留，不转换成数字，避免"6X"被误算。

---

## 3. Module（情报模块）

**路径**：`content/modules/{slug}.mdx`

```ts
export const ModuleSlug = z.enum([
  'oi-tracker', 'coinbase-premium', 'smart-money-radar', 'hyperliquid-radar',
  'hype-whale-watcher', 'kol-asset-tracker', 'jup-dca', 'custom-intel',
  // 规划中
  'funding-rate', 'liquidation-map', 'token-search', 'market-dashboard',
]);

export const Module = z.object({
  slug: ModuleSlug,
  code: z.string().regex(/^[MP]-\d{2}$/),          // M = 在运行，P = 规划中
  nameZh: z.string(), nameEn: z.string(),
  tagline: z.string().max(40),                     // 一句话，例如「散户看涨跌，机构看溢价」的改写版
  why: z.string().optional(),                      // 「为什么重要」；非 planned 必填。MDX 正文 = 「它是什么」
  category: z.enum(['derivatives', 'institutional', 'smart-money', 'onchain-behavior', 'custom', 'market']),
  status: z.enum(['member', 'beta', 'public', 'planned']),
  chains: z.array(Chain).default([]),
  sources: z.array(z.string()).default([]),
  frequency: z.string().optional(),
  delivery: z.string().optional(),
  limitations: z.array(z.string()).min(1).optional(), // status ≠ planned 时必填
  samples: z.array(z.object({                      // 推送样例（涂黑片段）
    lines: z.array(z.string()),                    // 用 ▇▇ 表示涂黑
    note: z.string().optional(),
  })).default([]),
  url: z.string().url().optional(),                // 有了 url 就显示「打开工具」
  order: z.number().int(),
});
```

- 涂黑样例的写法：原文中需要隐藏的部分用 `▇{n}` 表示，n 为字符宽度，例如 `集群 ▇{8} 共 6 个地址`。渲染时转成 `<Redaction w={8}/>`，**真实内容不写入仓库**
- `limitations` 是模块页上的「局限性」一节，status 不是 planned 时必填（诚实写明误报场景）
- 8 个模块的内容初稿：`docs/content/modules.md`

**变更**：新增 `tagline`、`why`（M8）、`limitations`、`samples`；code 区分 M（运行中）和 P（规划中）。

---

## 4. Research（研究文章）

**路径**：`content/research/{slug}.mdx`

```ts
export const Research = z.object({
  slug: z.string(),
  title: z.string().max(40),
  summary: z.string().max(120),
  publishedAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }).optional(),
  tags: z.array(z.string()).max(4).default([]),
  relatedSignals: z.array(Id).default([]),
  relatedModules: z.array(ModuleSlug).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});
```

---

## 5. SiteConfig（站点配置）

**路径**：`site.config.ts`（代码文件，不是 MDX）

```ts
export const site = {
  name: '0xInChain', nameZh: '链上情报局', nameEn: 'On-chain Intelligence Bureau',
  ledgerStartDate: '【待确认：台账起始日，建议等于上线日】',
  pricing: {
    currency: 'BNB',
    plans: [
      { period: 'quarter', label: '季度', from: '【待确认】' },
      { period: 'half',    label: '半年', from: '【待确认】' },
      { period: 'year',    label: '年付', from: '【待确认】' },
    ],
    note: '以 BNB 计价，按社群阶段动态调整，以管理员付款前最终确认为准',
  },
  batch: { name: '第二批', seats: 20, reviewPerDay: 1, status: 'open' as 'open' | 'full' },
  officialChannels: [
    { type: 'telegram', handle: '@gongxifacai_998', role: '入群管理员', numericId: '【待确认】' },
    { type: 'x', handle: '@0xInChain', role: '官方 X', numericId: '【待确认】' },
    // 【待确认：TG 公开频道 / 其他管理员】
  ],
  paymentAddresses: [],        // 【待确认：是否公示官方收款地址】
  social: { x: 'https://x.com/0xInChain', telegram: '【待确认】' },
} as const;
```

- `batch.status = 'full'` 时，加入区块的文案自动切换为「本批已满，可提交申请进入候补」
- `officialChannels` 是 `/verify`、footer、`/join/submitted` 页面共同的**唯一数据来源**，代码里不允许出现硬编码的账号

---

## 6. Agent（主理人档案）

**路径**：`content/pages/agent.mdx`

```ts
export const Agent = z.object({
  codename: z.string(),                 // 【待确认】
  handle: z.string(),                   // X handle
  since: z.string(),                    // 入行时间，例如 '2021'
  focus: z.array(z.string()).max(4),    // 专长
  style: z.string(),                    // 交易风格，例如「多空双向 · 波段为主」
  photo: z.string(),                    // 柴犬探员档案照（透明 PNG）
  why: z.string().max(300),             // 为什么做这件事（第一人称）
});
```

---

## 7. 显示字典（`lib/i18n/labels.ts`）

| 键 | 中文 | English |
|---|---|---|
| status.open / hit / invalidated / stopped / expired / void | 进行中 / 命中 / 失效 / 止损 / 超时 / 作废 | Open / Hit / Invalidated / Stopped / Expired / Void |
| direction.long / short / risk-alert | 做多 / 做空 / 风险预警 | Long / Short / Risk alert |
| category.derivatives / institutional / smart-money / onchain-behavior / custom / market | 衍生品 / 机构资金 / 聪明钱 / 链上行为 / 定制 / 市场 | Derivatives / Institutional / Smart money / On-chain behavior / Custom / Market |
| module status member / beta / public / planned | 成员专享 / 测试中 / 公开 / 规划中 | Members / Beta / Public / Planned |
| case result profit / loss / avoided / unknown | 盈利 / 亏损 / 规避下跌 / 未结束 |  |
