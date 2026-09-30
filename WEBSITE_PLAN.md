# 0xInChain / 链上情报局 — 官网建设 Plan

> 版本：v1.0 · 2026-09-29
> 阶段：Research → Analyze → Questions → **Plan**（本文档）
> 状态：策略、信息架构、视觉方向均已确认；可以进入 M1
> 依据：Linktree / Notion 原文分析、sac-ai.com 与 aiaptx.me 实测审计、Q1–Q23 决策记录（见附录 A）

---

## 目录

01 Project Goals · 02 Brand Positioning · 03 Target Users · 04 Reference Audit · 05 Site Architecture · 06 Homepage Architecture · 07 Conversion Funnel · 08 Community Performance Design · 09 Community Introduction · 10 On-chain Toolbox · 11 Visual Direction · 12 Content Strategy · 13 Technical Architecture · 14 Data / Content Architecture · 15 SEO · 16 Performance · 17 Responsive Strategy · 18 Accessibility · 19 Risk & Trust · 20 Analytics · 21 Development Milestones · 22 QA · 23 Launch · 附录 A 决策记录 · 附录 B 待确认事项 · 附录 C 未选中的视觉方向

---

## 01 Project Goals

### 1.1 商业目标（按优先级）

| 权重 | 目标 | 衡量方式 |
|---|---|---|
| 60% | **品牌可信度**：让 0xInChain 在中文 crypto 圈明确属于「专业链上情报」，而不是「喊单群」 | 台账页访问深度、案例/方法论阅读率、X 回链点击 |
| 30% | **合格申请**：把 X、TG 带来的关注者，转化成符合画像的入群申请 | 申请表提交数、提交率、管理员评估的合格率 |
| 10% | **工具增长（长期）**：为将来的公开工具和产品化预留入口与架构 | 工具箱页访问量、模块详情页阅读 |

### 1.2 V1 成功标准（上线后 60 天）

- 首次访问者在 5 秒内能回答：这是谁、提供什么、为什么可信、下一步点哪里（上线前做 5 人可用性测试验证）
- 台账从上线当天起**连续登记，没有断档**，失败和止损的记录与命中记录同等展示
- 申请表端到端可用：提交后消息 60 秒内到达管理员 TG，没有漏单
- 移动端 Lighthouse：Performance ≥ 90，Accessibility ≥ 95，SEO = 100
- 全站没有一处收益承诺类文案（CI 中的违禁词扫描为 0）

### 1.3 V1 明确不做（Non-goals）

- 用户账户、登录、会员后台
- 站内支付、钱包连接
- 实时数据 API、可交互的链上工具（工具箱 V1 只做展示）
- 完整的英文站（只做 `/en` 首页和 About）
- CMS 后台（内容通过仓库里的 MDX 文件管理）
- 在官网提及 0xRouter.app

---

## 02 Brand Positioning

### 2.1 重新回答 8 个基础问题

| # | 问题 | 结论 |
|---|---|---|
| 1 | 0xInChain 到底是什么 | 一个**由主理人主导的中文付费链上情报室**。它用自研的监控管道（CoinGlass 专业 API、四链聪明钱标签库、Hyperliquid 大单监控等）捕捉资金异动，筛选后以 TG 频道的形式交付 |
| 2 | 解决什么问题 | 半专业交易者**看不到主力资金在做什么**，自己又没有预算和能力搭建数据管道；市面上的信息要么是噪音（KOL），要么太贵太重（Nansen、Arkham 企业版） |
| 3 | 核心用户 | 有一定仓位、看得懂 OI、资金费率、链上地址的**中文半专业交易者**（见第 03 节） |
| 4 | 为什么值得关注 | ① 有真实的数据投入（付费 API、自研清洗算法）；② 多空双向，包括风险预警；③ 主理人自己也在做这些仓位（skin in the game）；④ **官网台账对每一条信号公开负责**，这是 V1 新增的差异点 |
| 5 | 免费用户得到什么 | X 上的复盘、官网台账（结案后完整公开）、精选案例、方法论、每月 Research |
| 6 | 付费用户得到什么 | 8 个模块的实时推送（未涂黑）、主理人实时操作播报、定制币种监控、内部直播、成员专属频道 |
| 7 | 和喊单群的区别 | 喊单群卖的是「结果」，0xInChain 卖的是「证据和依据」：每条信号都有模块来源、判断逻辑、结案规则，失败也公开记录 |
| 8 | 官网最重要的商业目标 | **用可验证的证据换取信任，再把信任转化成合格的入群申请** |

### 2.2 身份定位

**B. Professional On-chain Intelligence（主）+ D. Alpha Community（承接转化）**

| 定位 | 对网站设计的影响 | 是否采用 |
|---|---|---|
| A. Crypto KOL | Hero 放主理人大头像和战绩数字轮播，语气热烈 | ✗ 和「反对无脑跟单」冲突，会自降身价 |
| **B. On-chain Intelligence** | 证据优先，靠数据密度和方法论说话，语气冷静 | ✓ 主体：Hero、台账、工具箱都用 B 的语言 |
| C. Research Platform | 需要大量研报支撑 | △ 以每月 Research 作为增量，不作主定位 |
| **D. Alpha Community** | 圈层感、邀请制、成员权益 | ✓ 负责转化：社群介绍页和加入页 |
| E. Data Product | SaaS 式的功能页和定价表 | △ 作为长期方向，由工具箱承载，V1 不强调 |

### 2.3 Brand Identity

- **品牌名称**：主名 **0xInChain**（驼峰写法，读作 "0x · In · Chain"，与 X handle 一致）；副名 **链上情报局**；英文副名 *On-chain Intelligence Bureau*
  - 需要统一写法：Linktree 和 Notion 上的 `0xInchain`、X 显示名 "TwitterInsider | 链上情报" 都要逐步改成统一写法（见附录 B）
- **核心关键词**：情报 · 证据 · 实战 · 可复盘 · 克制
- **一句话定位**：
  - 中文：**面向中文实战交易者的链上情报局——用自研监控捕捉资金异动，用公开台账为每一条信号负责。**
  - English: *An on-chain intelligence bureau for traders — we track where capital moves, and we keep a public ledger of every call we make.*
- **核心价值**：可验证（Verifiable）· 有依据（Reasoned）· 敢记录失败（Accountable）
- **Brand Personality**：一位冷静、严谨的情报分析员，偶尔会眨一下眼（柴犬探员形象负责这一面）。专业但不端着，自信但不许诺。
- **Tone of Voice**：

| 要这样写 | 不要这样写 |
|---|---|
| 陈述事实，并给出来源和时间 | 用形容词堆砌气势（"史诗级""炸裂"） |
| 「这条信号已止损，−8.2%」 | 回避或隐藏失败的记录 |
| 「适合有自己交易体系的人」 | 「巨婴」「韭菜」这类攻击性说法（Notion 原文需要改写） |
| 「申请加入」「查看台账」 | 「最后名额」「错过就亏」「财富自由」「稳赚」「100% 胜率」 |
| 「过往表现不代表未来结果」 | 「跟着我们就能赚」 |

- **违禁词清单**（进入 CI 扫描，见第 22 节）：`稳赚` `保本` `必涨` `财富自由` `100%` `胜率高达` `错过就亏` `最后名额` `躺赚` `翻倍保证` `无风险` `内幕`（"内幕"只能在引用上下文中使用，需要白名单）

---

## 03 Target Users

| 画像 | 描述 | 来官网想得到什么 | 设计对策 |
|---|---|---|---|
| **P1 核心：半专业交易者** | 有交易经验，仓位几万到几十万 U，懂 OI、资金费率、Coinbase 溢价，但没有时间或资源自建工具 | 这是不是真货？数据从哪来？失败的怎么算？多少钱？ | 台账、方法论、模块详情、参考价 |
| **P2 X 上的观察者** | 在 X 上刷到某条复盘推文，第一次点进来 | 这条复盘可不可信？这个账号是做什么的？ | X 推文深链到 `/ledger/[id]`，每个详情页都有品牌介绍和 CTA |
| **P3 已有成员** | 在群里的付费用户，偶尔回官网 | 核对官方渠道、查看台账和 Research | `/verify` 页、台账筛选、Research |
| **P4 英文访客** | 从 X 上的英文内容进来 | 这个品牌是什么？ | `/en` 简版首页，明确说明「社群目前只服务中文用户」 |
| **反画像** | 新手、想无脑跟单、期待确定性收益的人 | 暴富承诺 | 用「适合 / 不适合」区块礼貌地劝退，不作攻击 |

---

## 04 Reference Audit

> 研究方式：用浏览器实测两站，桌面 1024×768、移动 375×812，通过 getComputedStyle 读取实际值。Lighthouse 与性能 trace 没有跑，性能判断是主观体感。

### 4.1 sac-ai.com（"Sac — AI 内容创作者 × Builder"）

**IA**：顶栏只有 "SAC" 和 "联系" 两项 → Hero：kicker + 179px 的 Playfair 字标 + 数据条（"3 万+ 关注 | 138.2 万+ 单篇阅读"）+ 右侧头像抠图 → 2×2 服务入口（商务 / 付费社群 / AI 定制 / 文章）→ 底部联系条。二级页共用一个模板（英文大写标签 + 衬线大标题 + 编号列表 + 联系条）。转化路径：服务卡 → 子页看价格 → 复制微信号或打开 TG，在站外成交。

**Visual**：米白 #F4EFE6 / 墨黑 #171513 / 焦橙 #EC6734 三色；Playfair Display、Noto Serif SC 配 Inter；卡片没有圆角、没有阴影，只用分隔线；密度很低，像一张杂志封面；只有浅色模式。

**Motion**：基本为零，没有进场动画，hover 也没有可见变化。

**5 秒测试**：「是谁」大致能懂；「提供什么」只能看到类别；「为什么继续看」靠 138.2 万阅读量；「下一步点哪」不清楚，4 个入口权重完全相同。

**Mobile**：隐藏头像，字标缩小，服务卡变单列，整体干净利落。

- **值得借鉴**：①超大衬线字标带来主理人品牌的分量感；②三色系统，强调色只用在数字和编号上；③核心数据直接放进 Hero；④目录式列表（编号 + 标题 + 指标 + →）很适合做台账和案例索引；⑤移动端果断隐藏装饰元素；⑥二级页共用一个模板
- **不建议借鉴**：①零动效，链上情报需要「活」的感觉；②入口等权，没有主 CTA；③成交只能「加微信」；④只有浅色，和交易者看盘时的深色环境冲突；⑤没有 footer，也没有社交矩阵；⑥没有内容样本，付费价值只能靠想象
- **0xInChain 做得更好**：Hero 放真实的最新台账；一句话写清价值主张；只保留一个主 CTA，移动端吸底；在付费墙前面放涂黑的情报样本；社会证明分层（台账统计、案例、主理人档案）；深色为主，提供中英文入口

### 4.2 aiaptx.me（"链上 101"）

**IA**：没有导航。一屏报纸式的分格版面（CSS grid 行比例 `2.5fr 2.5fr 2fr 0.7fr 1.5fr`），格与格之间用 1px 黑线分隔：Hero（"Hi, I'm Ai 姨" + 逐字轮播的身份文案）/ Monitoring（"Smart Money, Market Maker, Whales, Insider, Weak Hands, **Anything interesting on-chain**"）/ 5 个内容分类 / About Me / Buy Me A Coffee（钱包地址）。没有主 CTA，转化靠外链和打赏。

**Visual**：纯白底、近黑文字，全站只有一处用了砖红 #A14041；只用系统字体；H1 36px 对 H3 30px，层级很平；没有卡片化设计；只有浅色模式。

**Motion**：分隔线从左往右画出来（有意义）；身份文案逐字模糊进场（有意义）；**进场动画让首屏空白了 5–10 秒**（为动画而动画，严重伤害首屏可读性）。

**5 秒测试**：四项全部不及格。首屏基本空白，没有 CTA，也没有任何背书。

**Mobile**：纵向堆叠；内容区高度固定、内部滚动，有内容被截断；About 折叠后能否展开未验证。

- **值得借鉴**：①报纸分格版面，契合「情报简报」的隐喻；②「我们盯什么」这种清单式文案结构，最后一句用强调色收尾；③全站只用一个强调色、只用一次；④分类项采用「标题 + 一行说明」
- **不建议借鉴**：①阻塞式的进场动画；②没有 CTA、没有转化路径；③系统字体导致没有品牌辨识度；④层级太平；⑤没有任何社会证明；⑥格子内部独立滚动，在移动端体验很差
- **0xInChain 做得更好**：分隔线画出的仪式感保留，但控制在 ≤600ms，并且**文字从第一帧就可读**；「我们盯什么」从静态文案升级为附带真实台账的证据区；有明确的主 CTA；有品牌字体；层级拉开

### 4.3 两站共同的空白（也就是 0xInChain 的机会）

数据在动的「活」感 · 唯一的主 CTA · 付费墙前的情报样本 · 可验证的战绩 · 深色环境 · 中英文入口 · 风险披露 · 防冒充机制

---

## 05 Site Architecture

### 5.1 为什么选「首页 + 子页」，而不是单页

- 台账和案例会**持续增长**，单页撑不住，也没法做深链
- X 推文需要**深链到具体档案**（`/ledger/IC-2026-0001`），这是 P2 用户的主要入口，也是 SEO 的长尾流量
- 每个子页都能有自己的 OG 卡片，方便在 X 上传播
- 首页只负责讲清楚、给证据、引导去往哪里；深度内容放在子页

### 5.2 Recommended Sitemap

```
/                              首页
├── /ledger                    社群战绩 · 信号台账（主）
│   └── /ledger/[id]           单条档案详情（X 深链的落地页）
├── /cases                     精选案例（历史 50+ 条，标注「精选」）
│   └── /cases/[slug]          案例详情
├── /methodology               方法论：台账规则、收益口径、结案规则
├── /tools                     链上工具箱（A 窗格系统）
│   └── /tools/[slug]          模块详情
├── /community                 社群介绍：你会得到什么、交付方式、适合谁、规则、FAQ
├── /about                     主理人档案 + 情报局的由来
├── /research                  Research 列表（每月 1–2 篇）
│   └── /research/[slug]
├── /join                      申请加入：流程、参考价、名额、申请表
│   └── /join/submitted        提交成功页（附防骗提醒）
├── /verify                    官方渠道验证
├── /legal/risk                风险披露
├── /legal/privacy             隐私说明
├── /legal/terms               服务条款（含不退款政策）
├── /en                        English 首页（简版）
│   └── /en/about
└── 404
外链：X ↗ · Telegram 公开频道 ↗（待确认是否存在，见附录 B）
```

| 页面 | 存在理由 |
|---|---|
| `/ledger` | 信任的核心资产；前向全量记录，防止 cherry-picking |
| `/ledger/[id]` | X 深链的落地页；单条信号的完整证据链 |
| `/cases` | 容纳历史的 50+ 条复盘，和台账**分开存放**，避免把精选案例混入全量统计 |
| `/methodology` | 回答「数字怎么算的」，和台账配套 |
| `/tools` | 把「付费到底买到什么」讲清楚，也为工具产品化预留入口 |
| `/community` | 转化前的深度了解 |
| `/about` | 化名但可信的主理人档案，承接 skin-in-the-game 的叙事 |
| `/research` | 支撑 C 定位的增量内容和 SEO |
| `/join` | 唯一的转化终点 |
| `/verify` | 防冒充：邀请制加 TG 私聊的模式天然容易被冒充 |
| `/legal/*` | 合规底线 |
| `/en` | X 海外流量的门面；社群只服务中文用户，所以不做完整英文站 |

### 5.3 导航

**桌面顶栏（报头式）**：

```
[0xInChain 链上情报局]    社群战绩   链上工具箱   社群介绍   X ↗        [ 申请加入 ]
```

| 客户要求的入口 | 最终处理 | 类型 | 理由 |
|---|---|---|---|
| 社群战绩 | 第 1 位 → `/ledger` | 页面 | 信任是第一目标；也是 X 访客最想验证的东西 |
| 链上工具箱 | 第 2 位 → `/tools` | 页面 | 回答「数据从哪来、买到什么」，从能力层面建立信任 |
| 社群介绍 | 第 3 位 → `/community` | 页面 | 在已经信任的基础上了解细节 |
| X / Twitter | 第 4 位，外链 ↗，新窗口打开 | 外链 | 次要出口，不应抢走站内流量，所以放在最后 |
| 付费加入 | 改名为 **申请加入**，作为右侧唯一的实心按钮 → `/join` | 页面 + Primary CTA | 邀请制的真实流程是「申请」；首次接触时「付费」二字阻力大。价格在 `/join` 公开，并不隐瞒 |

> 如果客户坚持使用「付费加入」字样：只改按钮文案即可，不影响架构。

**移动端**：
- 顶栏：字标（缩短为 `0xInChain`）+ 小号「申请」按钮 + 菜单按钮
- 菜单：全屏档案夹式抽屉，包含 4 个导航项、`/verify`、语言切换、X/TG 外链
- 滚动越过 Hero 后，底部出现吸底条「申请加入 →」（`/join` 页不显示）
- 不使用汉堡菜单里藏主 CTA 的做法

**Footer**：风险披露摘要 · 官方渠道验证 · 站点链接 · 法律页 · 语言切换 · 「台账最后更新：YYYY-MM-DD HH:mm (UTC+8)」

---

## 06 Homepage Architecture

### 6.1 Section 顺序与理由

```
① 报头导航
② Hero · 档案封面              ← 5 秒内回答：是谁、做什么、下一步
③ 证据条                       ← 马上给出可验证的事实
④ 我们盯什么                   ← 讲清情报范围（能力）
⑤ 最新台账                     ← 用真实记录证明，包括失败的
⑥ 情报如何产生                 ← 讲机制，而不是讲结果
⑦ 情报样本（涂黑）             ← 让付费价值被看见
⑧ 工具箱预览                   ← 能力的广度
⑨ 精选案例                     ← 深度的故事（标注精选）
⑩ 主理人档案                   ← 是谁在负责
⑪ 适合 / 不适合                ← 筛选，提高申请质量
⑫ 加入                         ← 流程、价格、名额、CTA
⑬ 最新 Research（有内容才显示）
⑭ Footer
```

**排序逻辑**：身份 → 事实 → 范围 → 证据 → 机制 → 价值 → 广度 → 深度 → 负责人 → 匹配度 → 行动。每个区块都在回答上一个区块自然引出的疑问：「凭什么信你？」→ 台账；「数据哪来的？」→ 机制；「我能得到什么？」→ 样本和工具箱；「谁在做？」→ 主理人；「适合我吗？」→ 筛选；「怎么加入？」→ 加入。**价格和申请放在信任链的末端**，符合「品牌为主、转化为副」的权重。

### 6.2 逐个 Section

#### ② Hero · 档案封面
- **Purpose**：5 秒内说清是谁、做什么、为什么可信、下一步
- **Content**：
  - 左上元信息：`FILE № IC-2026 · 链上情报局 · On-chain Intelligence Bureau`
  - H1：**链上情报局**（衬线 900，极大字号）
  - 主张：「把链上资金的每一次异动，整理成可复盘的情报档案。」
  - 元信息行：`台账始于 2026.MM.DD · 已登记 N 份 · 覆盖 ETH / BSC / BASE / SOL / Hyperliquid`（构建时计算）
  - CTA：主「申请加入」，次「查看信号台账 →」
  - 右侧：**最新一份已结案档案卡**，斜放 −2°，盖着对应状态的印章（命中 / 失效 / 止损，**如实显示最新的一份，不挑选**）
- **Layout**：8 栏网格，文字占左 5 栏，档案卡占右 3 栏；左侧批注栏放编号
- **Visual**：墨灰底 + 纸纹噪点；H1 下方一条分隔线画出
- **CTA**：申请加入（印章红实心）/ 查看信号台账（下划线文字链）
- **Motion**：分隔线画出（400ms）→ 档案卡落下，印章盖上（200ms，只触发一次）。**文字从第一帧就可见**，不做阻塞式动画
- **Desktop**：左右分栏，首屏完整展示
- **Mobile**：H1 约 64px；档案卡移到 CTA 下方并放正，缩小到 90% 宽；元信息行改为横向滚动

#### ③ 证据条
- **Purpose**：马上给出可核验的事实，而不是口号
- **Content**：台账总数、命中数、失效数、止损数、进行中数、中位结案收益、覆盖链数、数据源（CoinGlass Pro 等），每个数字都能点到 `/ledger` 对应的筛选结果
- **Layout**：一行 6 格，格间用细分隔线，数字用等宽字体
- **Visual**：卷宗黄小标签 + 骨白数字；**不放单独的「胜率 %」大数字**
- **CTA**：整条可点 → `/ledger`
- **Motion**：数字进入视口时滚动到目标值一次（≤800ms）；开启减少动效时直接显示
- **Desktop**：一行排开
- **Mobile**：2×3 网格

#### ④ 我们盯什么
- **Purpose**：讲清情报范围（借鉴 aiaptx 的 Monitoring 结构并升级）
- **Content**：「我们盯着：聪明钱地址集群 · 交易所巨鲸 · 衍生品 OI 异动 · Coinbase 溢价 · Hyperliquid 大单 · KOL 钱包 · DCA 流向 ——**以及链上任何反常的动静。**」每个词都链接到对应的模块详情
- **Layout**：大号衬线文字段落，居左，宽 ~20ch 一行
- **Visual**：最后一句用印章红；其余骨白
- **CTA**：词条本身就是链接
- **Motion**：无（纯排版）
- **Desktop / Mobile**：同一段文字自然换行，移动端字号用 clamp 缩小

#### ⑤ 最新台账
- **Purpose**：用真实记录证明，**包括失败和进行中的**
- **Content**：最新 5 条档案（进行中的显示涂黑条），字段：编号 / 立案日 / 模块 / 方向 / 状态印章 / 结案收益
- **Layout**：目录式列表（借鉴 sac-ai）：编号 · 内容 · 状态 · →
- **Visual**：进行中那一行的标的和价格用黑条遮住，并带「成员可见」提示
- **CTA**：「查看完整台账（N 份）→」
- **Motion**：进入视口时逐行打印（每行 60ms 错开）
- **Desktop**：表格式单行
- **Mobile**：每条变成两行卡片，印章在右上角

#### ⑥ 情报如何产生
- **Purpose**：讲机制，建立「不是拍脑袋」的认知
- **Content**：5 步管道：采集（CoinGlass Pro API、链上节点、地址标签库）→ 清洗（自研去噪算法）→ 判断（主理人复核）→ 推送（TG，带时间戳）→ 登记（官网台账，结案后公开全部内容）
- **Layout**：横向 5 格的流程图，每格有编号、标题、一句说明
- **Visual**：档案夹分隔线串起 5 格；第 5 步「登记」用印章红高亮，这是差异点
- **CTA**：「阅读方法论 →」
- **Motion**：连接线随滚动依次画出
- **Desktop**：横排
- **Mobile**：竖排时间线

#### ⑦ 情报样本（涂黑）
- **Purpose**：让付费价值被看见，而不是被想象
- **Content**：一条真实的 TG 推送样本（取自已结案的信号），关键字段（地址、价格、仓位）用涂黑条遮住；旁边批注说明「这是 OI 异动模块的一条推送，成员会实时收到完整版本」
- **Layout**：左边是样本（仿 TG 消息卡），右边是批注栏
- **Visual**：**涂黑机制是整个视觉方向的核心**；鼠标悬停涂黑条时显示「成员可见 · 申请加入 →」
- **CTA**：涂黑条的提示本身 → `/join`
- **Motion**：进入视口时，涂黑条从左往右「刷上」（300ms）
- **Desktop**：左右布局
- **Mobile**：上下堆叠，点按涂黑条显示提示

#### ⑧ 工具箱预览
- **Purpose**：展示能力的广度；作为 A 窗格风格的「预告」
- **Content**：8 个模块的迷你窗格：代号 M-01…、名称、覆盖链、状态点（运行 / 测试）
- **Layout**：4×2 窗格，间隙为 0，1px 分隔线
- **Visual**：这是首页唯一一处用等宽字体加窗格的区块，作为 B→A 的过渡
- **CTA**：「进入链上工具箱 →」
- **Motion**：hover 时窗格标题栏的方括号 `[ ]` 收拢
- **Desktop**：4×2
- **Mobile**：2×4，或横向滑动

#### ⑨ 精选案例
- **Purpose**：用有深度的故事展示分析能力
- **Content**：3 个案例，其中至少 1 个是做空或风险预警（例如 $GUA 风险预警），每个案例写标的、逻辑一句话、结果、原始 X 推文链接
- **Layout**：3 张档案卡
- **Visual**：区块标题旁放醒目标签「**精选 · 非完整记录**」，并链接到台账
- **CTA**：「全部案例 →」「查看完整台账 →」
- **Motion**：hover 时卡片轻微抬起 2px，描边变亮
- **Desktop**：3 列
- **Mobile**：横向滑动，露出下一张的一部分

#### ⑩ 主理人档案
- **Purpose**：说明谁在负责，承接 skin-in-the-game 的叙事
- **Content**：柴犬探员「证件照」（用回形针别在档案上），代号，专长（链上地址集群、衍生品），入行时长，一句「为什么做这件事」，X 链接
- **Layout**：左照片，右档案字段（表单式排版）
- **Visual**：照片为基础款叉腰或「That's me!」姿势；档案字段用 IBM Plex Mono
- **CTA**：「完整档案 →」（`/about`）、「在 X 关注 ↗」
- **Motion**：进入视口时回形针「夹上」（一次）
- **Desktop / Mobile**：移动端改为上下排列，照片 120px

#### ⑪ 适合 / 不适合
- **Purpose**：礼貌地筛选，提高申请质量（改写自 Notion 原文的专业版本）
- **Content**：适合——有自己的交易体系、把情报当作决策辅助、能接受亏损是交易的一部分。不适合——期待确定性收益、想完全跟单、无法承受波动
- **Layout**：两栏对照
- **Visual**：适合一栏用骨白，不适合一栏用褪色处理；不使用红叉绿勾这种廉价符号
- **CTA**：无（刻意不放）
- **Motion**：无

#### ⑫ 加入
- **Purpose**：唯一的转化区块
- **Content**：
  - 4 步流程：提交申请 → 管理员通过**官方 TG 账号**联系 → 确认周期和价格 → 付款入群
  - 参考价：「季度 X BNB 起 · 半年 · 年付；以 BNB 计价，按阶段动态调整，以管理员最终确认为准」
  - 名额：「第二批 · 20 席 · 每日审核 1 位」，后面附一句为什么限流（防止地址信息被聚合群转发，保护信号质量）
  - 规则：不设试用，售出不退款（写明，并链接到条款页）
- **Layout**：左边流程和规则，右边参考价卡片和 CTA
- **Visual**：印章红 CTA 按钮；不做倒计时，不做红色警告
- **CTA**：「申请加入 →」
- **Motion**：无，保持稳定可信
- **Mobile**：流程变竖排，CTA 全宽

#### ⑬ 最新 Research
- 有文章才显示；2 篇，目录式列表；CTA「全部 Research →」

#### ⑭ Footer
- 风险披露摘要（2 行）· 「官方渠道仅限 /verify 列出的账号。除了回复你的申请，管理员不会主动私信你」· 站点地图 · 法律页 · 语言 · 台账最后更新时间

---

## 07 Conversion Funnel

### 7.1 漏斗

```
流量来源
  X 复盘推文 ──────────────┐ （深链到 /ledger/[id] 或 /cases/[slug]）
  X 主页 bio / Linktree ───┤
  TG 公开频道 ─────────────┤ （→ 首页）
  搜索 / 口碑 ─────────────┘
          ↓
① 理解（5 秒）   Hero：这是链上情报局，有公开台账
          ↓
② 核验           证据条 → 台账（包括失败的）→ 方法论
          ↓
③ 理解机制       情报如何产生 → 工具箱 → 模块详情
          ↓
④ 看见价值       涂黑的情报样本 → 「成员可见」
          ↓
⑤ 信任负责人     主理人档案 → X 历史
          ↓
⑥ 自我匹配       适合 / 不适合
          ↓
⑦ 行动           /join：流程 + 参考价 + 名额 → 申请表
          ↓
⑧ 站外成交       官方 TG 联系 → /verify 核对 → 付款 → 入群
```

**X 深链落地路径**（P2 的主路径）：`/ledger/[id]` 详情 → 页面底部的「这是 0xInChain 台账中的第 N 份档案」品牌区块 → 台账全览 或 申请加入。**每个详情页都是一个迷你落地页。**

### 7.2 为什么会继续浏览 → 信任 → 点击

| 阶段 | 用户心理 | 用什么回应 | 不用什么 |
|---|---|---|---|
| 继续浏览 | 「又一个喊单站？」 | Hero 就放出台账和一份真实的档案（可能是止损的） | 收益数字轮播 |
| 产生信任 | 「数字是真的吗？失败的呢？」 | 前向全量台账、即时登记加涂黑、结案规则、TG 时间戳证据 | 「胜率 90%」 |
| 理解价值 | 「付钱能得到什么？」 | 涂黑样本、8 个模块的详情 | 模糊的「独家 Alpha」 |
| 点击加入 | 「值不值？会不会被骗？」 | 公开参考价、流程、官方渠道验证、不退款规则写在明处 | 倒计时、「最后名额」、私聊报价 |

### 7.3 微转化（Micro-conversions）

关注 X · 加入 TG 公开频道（如果存在）· 阅读方法论 · 查看模块详情 · 查看台账详情。这些都算作漏斗健康度的指标（见第 20 节）。

---

## 08 Community Performance Design（社群战绩）

### 8.1 三层结构

| 层 | 路由 | 内容 | 是否计入统计 |
|---|---|---|---|
| **信号台账 Ledger** | `/ledger` | 上线日起的**全部**信号，前向全量记录 | ✓ 所有统计只来自这里 |
| **精选案例 Cases** | `/cases` | 历史的 50+ 条 X 复盘，以及以后值得深写的案例 | ✗ 明确标注「精选 · 非完整记录」 |
| **方法论 Methodology** | `/methodology` | 登记规则、结案规则、收益口径、证据类型 | — |

### 8.2 档案生命周期（Q21-B：即时登记 + 涂黑）

```
TG 推送（T0）
   ↓  ≤ 2 小时内
立案登记   status=open    只公开：编号、立案时间、模块、方向、链；标的和价格涂黑
   ↓  触发结案规则
结案       status=hit | invalidated | stopped | expired
           全部公开：标的、入场、依据、结案价、最大涨幅、结案收益、证据
   ↓  （例外）
作废       status=void    保留条目并写明原因，永不删除
```

- **结案规则**（写进方法论，按模块可配置）：达到预设目标 → `hit`；触发失效条件 → `invalidated`；触发止损 → `stopped`；超过最长持有期（默认 30 天）→ `expired`，以当时价格结算
- **不可删除**：任何一条都不能删除，只能作废并写明理由；每条都有 `changelog`，任何修改都会显示出来
- **增量（M6 之后）**：立案时公开完整内容的 SHA-256 哈希，结案时公开原文，任何人都能验证（Q21-C）

### 8.3 字段设计

| 字段 | 立案时 | 结案后 | 说明 |
|---|---|---|---|
| 编号 `IC-2026-0001` | ✓ | ✓ | 连续编号，编号断档本身就会暴露删除 |
| 立案时间（TG 推送时间） | ✓ | ✓ | 精确到分钟，UTC+8 |
| 登记时间 | ✓ | ✓ | 和立案时间的差应 ≤ 2h |
| 模块 | ✓ | ✓ | 链接到 `/tools/[slug]` |
| 方向 | ✓ | ✓ | 做多 / 做空 / 风险预警 |
| 链 | ✓ | ✓ | |
| 标的 | 涂黑 | ✓ | |
| 入场价 / 入场逻辑 / Thesis | 涂黑 | ✓ | |
| 目标 / 止损 / 失效条件 | 涂黑 | ✓ | 预设的结案规则 |
| 结案时间 / 持有时长 | — | ✓ | |
| 最大涨幅（MFE） | — | ✓ | 持有期内最有利的价格偏移 |
| 最大回撤（MAE） | — | ✓ | 持有期内最不利的偏移，也是可信度信号 |
| **结案收益** | — | ✓ | 按结案规则计算；**统计默认用这个口径** |
| 图表 | — | ✓ | 入场、峰值、结案三点标注，加编辑式批注 |
| 证据 | 部分 | ✓ | TG 消息截图（带时间）、链上 tx 或地址（结案后）、X 推文 |
| 风险提示 | ✓ | ✓ | 每条档案都有固定文案 |

### 8.4 统计展示（Q22-B）

- 台账页顶部：总数、各状态数量（命中 / 失效 / 止损 / 超时 / 进行中）、**结案收益的中位数**、平均持有天数、统计区间
- **不在 Hero 或任何显眼位置放单独的「胜率 %」**；如果在表格里出现命中率，必须带样本数 n 和区间，例如「命中 12 / 结案 20（2026.10–2026.12）」
- 可按模块、链、方向、状态、月份筛选；筛选后的统计实时重算（在构建时预计算好）
- 每月自动生成一份「月度台账摘要」（静态页，或者一张 OG 图，可以直接发 X）

### 8.5 如何避免 Cherry Picking（总结）

1. 前向全量记录，**台账起始日**在台账页和首页上醒目展示
2. 编号连续，只允许作废，不允许删除，修改都留痕
3. 即时登记（≤2h）加涂黑，从机制上杜绝事后补登
4. 失败记录和成功记录**使用同样的卡片大小和版式**，只有印章不同
5. 历史案例和台账物理分开，统计不混算
6. Hero 的档案卡如实显示「最新一份已结案」，不做挑选
7. 收益口径公开，默认按结案收益，最大涨幅只作参考

---

## 09 Community Introduction（社群介绍）

### 9.1 `/community` 页面结构

1. **一句话**：「一个只服务中文实战交易者的付费链上情报室。」
2. **你会得到什么**：8 个模块的实时推送（链接到工具箱）、主理人操作同步播报、定制币种监控（一人一个币种）、满员后的内部直播、成员专属频道
3. **交付方式**：TG 私密频道 + 群；附一张「一天的节奏」时间线示例（例如：09:12 OI 异动 → 11:40 聪明钱集群建仓 → 21:05 主理人操作同步）
4. **适合 / 不适合**：首页版本的完整版
5. **规则**：周期（季度 / 半年 / 年）、BNB 计价与动态调价的原因、不设试用、不退款、每天审核 1 位的原因
6. **FAQ**：数据从哪里来？信号多久一条？可以只买一个模块吗？续费怎么算？怎么确认联系我的是官方？
7. **CTA**：申请加入

### 9.2 `/about` 主理人档案

- 代号、柴犬探员档案照、专长、入行时长、交易风格（多空双向）
- 「为什么创建链上情报局」（第一人称，300 字以内）
- 情报局大事记：成立、第一批满员、台账上线……
- 数据投入透明：CoinGlass Pro（$699/月）等付费数据源（这本身就是信任信号）
- 官方账号列表（和 `/verify` 同源）

### 9.3 文案改写原则

Notion 原文里的「巨婴」「韭菜」「破防」等说法，全部改写成中性、专业的表达，保留**筛选的意图**，去掉**攻击性**。

---

## 10 On-chain Toolbox（链上工具箱）

### 10.1 工具分类（基于现有 8 个模块 + 未来扩展）

| 类别 | 现有模块（状态） | 未来候选 |
|---|---|---|
| **衍生品 Derivatives** | M-01 Elite OI Tracker · OI 异动预警（成员） | Funding Rate、Liquidation 热图 |
| **机构资金 Institutional** | M-02 Institutional Heatmap · Coinbase 溢价（成员） | ETF 流向、Exchange Flow |
| **聪明钱 Smart Money** | M-03 全链聪明钱雷达（BSC/BASE/ETH/SOL）（成员）· M-04 Hyperliquid 聪明钱雷达（成员）· M-05 HYPE Whale Watcher（测试）· M-06 KOL Asset Tracker（测试） | 地址分析、集群查询 |
| **链上行为 On-chain Behavior** | M-07 JUP DCA 深度解析（成员） | Token 持仓分布 |
| **定制 Custom** | M-08 币种链上情报申请（成员） | Token Search |
| **市场总览 Market**（规划） | — | Market Dashboard |

### 10.2 Card structure（A 窗格系统）

```
┌─ M-01 / DERIVATIVES ─────────────────── ● 运行中 ─┐
│ Elite OI Tracker                                   │
│ OI 异动预警                                        │
│                                                    │
│ 数据源   CoinGlass Pro API · 1200 req/min          │
│ 覆盖     Binance · OKX · Bybit · Hyperliquid       │
│ 频率     分钟级                                    │
│ 交付     TG 成员频道                               │
│                                                    │
│ ▓▓▓▓▓▓▓▓ 推送样例（涂黑）▓▓▓▓▓                     │
├────────────────────────────────────────────────────┤
│ 关联台账 12 份 →                     [ 查看详情 ]  │
└────────────────────────────────────────────────────┘
```

- **状态**：`member`（成员专享）· `beta`（测试中）· `public`（公开可用，将来才有）· `planned`（规划中）
- 卡片数据结构从第一天起就预留 `url` 字段：将来某个模块上线网页版，只需要填入 url，卡片上就会出现「打开工具」按钮，**不需要改架构**
- 「关联台账 N 份」：把工具和台账连起来，证明这个模块确实在产出信号

### 10.3 Information Architecture

- `/tools`：分类筛选（全部 / 衍生品 / 机构资金 / 聪明钱 / 链上行为 / 定制）+ 状态筛选；窗格网格
- `/tools/[slug]`：它是什么 → 为什么重要 → 数据源与方法 → 推送样例（涂黑）→ 局限性（诚实写明误报场景）→ 关联台账 → 如何获得（成员 / 公开）

### 10.4 逐步扩展路线

| 阶段 | 内容 | 技术影响 |
|---|---|---|
| **S0（V1）** | 展示 8 个模块，全部静态 | 只需要 MDX 注册表 |
| **S1** | 选 1 个模块做**公开延迟版**（例如 Coinbase 溢价指数的日线、OI 异动的 24h 延迟版） | 服务端定时拉取 + ISR 缓存；API key 只放在服务端 |
| **S2** | 可交互的轻工具：Token Search、地址查询 | 独立的 `/tools/[slug]` 应用段，按需使用客户端组件；需要限流 |
| **S3** | 账户体系、成员专享的网页版仪表盘、API | 视情况拆分到 `app.` 子域名，官网保持内容站的性质 |

---

## 11 Visual Direction（已选定：B「情报档案」为主体 + A 窗格系统用于工具箱）

### 11.1 设计概念

**「情报局的档案室」**：主站就是一间档案室，每条信号都是一份立案、结案的卷宗，付费墙就是涂黑的部分。工具箱是**档案室隔壁的监控室**：换成 A 的窗格和等宽数据字体，但沿用同一套色板，所以不会割裂。

### 11.2 Design Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--ink-0` | `#14161A` | 页面底色（墨灰） |
| `--ink-1` | `#1B1E23` | 纸面区块、档案卡 |
| `--ink-2` | `#252930` | 悬停、窗格标题栏 |
| `--line` | `#343841` | 1px 分隔线 |
| `--bone` | `#E9E4D8` | 正文（暖骨白） |
| `--bone-dim` | `#A8A398` | 次要文字 |
| `--stamp` | `#E8604A` | **唯一强调色**：印章、关键句、描边（M1 实测后由 #D6452F 调整） |
| `--stamp-fill` | `#A93322`（hover `#B83A26`） | 主 CTA 按钮底色，上面配 bone 文字 |
| `--dossier` | `#C9A96A` | 编号、批注、元信息（卷宗黄） |
| `--gain` / `--loss` | `#6FBF8E` / `#E07A68` | 只用于数据中的涨跌，饱和度刻意压低，避免抢印章红 |
| `--redact` | `#0B0C0E` | 涂黑条 |

- 对比度（M1 实测，详见 `design/README.md`）：`--bone` 对 `--ink-0` 为 14.28；`--bone-dim` 为 7.21；`--stamp` 为 5.35；按钮上 `--bone` 对 `--stamp-fill` 为 5.20
- V1 **只做深色**。浅色模式列入待办，不承诺

### 11.3 Typography

| 角色 | 字体 | 用法 |
|---|---|---|
| 中文展示 | **Noto Serif SC** 700 / 900 | H1、H2、区块标题 |
| Latin 展示 | **Newsreader**（Display 光学尺寸） | 英文副标题、`/en` 页标题 |
| 正文 | **Noto Sans SC** 400 / 500 | 正文、UI |
| 批注 / 元信息 | **IBM Plex Mono** 400 / 500 | 编号、时间戳、档案字段 |
| 数据（工具箱） | **Martian Mono** 400 / 500 | 窗格内数据，使用 tabular-nums |

- 字号：H1 `clamp(64px, 10vw, 128px)` · H2 `clamp(32px, 4vw, 48px)` · H3 24 · body 17 / 1.75 · meta 13 · data 13
- 中文字体**不预加载**，依赖 Google Fonts 的 unicode-range 切片按需加载；只预加载 Latin 展示字体
- 中文正文行宽 ≤ 38 个汉字；中英文之间自动加空格（在内容规范里约定，不依赖 JS）

### 11.4 网格与版式

- **主站**：8 栏编辑式网格，最大宽度 1280px；左侧 1 栏是**批注栏**（编号、日期、来源），正文区最宽 68ch
- **工具箱（A）**：12 栏窗格，间隙为 0，1px 线分割；窗格左上角是大写标签 `M-01 / DERIVATIVES`
- 区块间距：桌面 128px / 移动 80px；区块之间用「档案夹分隔线」：一条细线加左端一个标签，例如 `§ 05 最新台账`

### 11.5 核心组件语言

| 组件 | 设计 |
|---|---|
| **档案卡 CaseFile** | 圆角 2px，1px `--line` 描边，`--ink-1` 底；左上编号，右上状态印章，底部是元信息行 |
| **印章 Stamp** | 双线圆角矩形，`--stamp` 描边加文字，旋转 −6°；类型：`命中` `失效` `止损` `超时` `进行中` `作废`。**颜色不是唯一的区分，每个印章都有文字** |
| **涂黑 Redaction** | `--redact` 实心条，长度约等于原文长度（用占位字符估算）；hover 或点按时显示「成员可见 · 申请加入 →」。**不在 DOM 中放真实内容**（见第 14 节） |
| **窗格 Pane**（A） | 无圆角，标题栏高 32px，放标签 + 状态点 + 更新时间；hover 时标题两侧出现 `[ ]` |
| **按钮** | 主按钮：`--stamp` 底加 `--bone` 字，2px 圆角；次按钮：文字加 1px 下划线，hover 时下划线从左往右画出；工具箱内按钮：方角描边 |
| **批注 Marginalia** | IBM Plex Mono 12px，`--dossier` 色，放在左侧批注栏 |
| **图表** | 刊印风格：单色细线（1.25px `--bone`），关键点用 `--stamp` 圆点，用衬线字体做编辑式批注（① ② ③）；不做面积填充，不做渐变 |
| **图标** | 极少使用；用编号、印章、手绘箭头代替。实在需要时，用 Lucide 1.5px 线性图标 |

### 11.6 图像：柴犬探员使用规则（Q23-B）

| 场景 | 姿势 | 处理 |
|---|---|---|
| 主理人档案照（首页 ⑩、`/about`） | 基础款叉腰 / 「That's me!」 | 放进档案照片框，用回形针别住，照片轻微降饱和，保持在 ink 色板里 |
| 申请提交成功 `/join/submitted` | 点赞眨眼 | 小尺寸，配合防骗提醒 |
| 404 | 托腮思考类姿势（如果没有，就用「That's me!」） | 文案：「这份档案不存在，或已被归档。」 |
| 台账空状态 | 基础款 | 「今天还没有新的立案。」 |

- **禁用**：Winner 奖杯、皇冠（暗示赢钱）；情人节和春节系列（只用于社媒的节日运营）
- **素材要求**（M4 前置依赖）：透明背景 PNG ≥ 1200px，或 SVG；**不能带 AI 生成工具的水印**；现在 images/ 里的截图只能作为参考，不能上线

### 11.7 Motion 清单（全部支持 `prefers-reduced-motion`）

| 动效 | 时长 | 触发 | 目的 |
|---|---|---|---|
| 分隔线画出 | 400ms ease-out | 进入视口（一次） | 档案展开的仪式感 |
| 印章盖下 | 200ms（缩放 1.3→1 加 2px 抖动） | 状态首次出现（一次） | 强调结案，这是信任动作 |
| 台账逐行打印 | 每行错开 60ms | 进入视口（一次） | 数据是「活」的 |
| 涂黑条刷上 | 300ms | 进入视口（一次） | 付费墙的隐喻 |
| 数字滚动 | ≤ 800ms | 进入视口（一次） | 证据条 |
| 下划线画出 | 200ms | hover | 次按钮反馈 |
| 窗格 `[ ]` 收拢 | 150ms | hover | 工具箱反馈 |

**原则**：没有任何动画会阻塞内容的可读性；首屏文字在第一帧就可见；没有持续循环的动画；不使用自定义光标。

---

## 12 Content Strategy

### 12.1 内容类型与节奏

| 类型 | 节奏 | 负责人 | 格式 |
|---|---|---|---|
| 台账档案 | 每条信号推送后 ≤ 2h 立案；结案后 ≤ 24h 补全 | 主理人 / 运营 | MDX（每条一个文件） |
| 月度台账摘要 | 每月 1 日 | 自动生成 + 人工写 1 段点评 | 构建时生成 |
| 精选案例 | 按需 | 主理人 | MDX |
| Research | 每月 1–2 篇 | 主理人 | MDX |
| 模块详情 | 模块变化时 | 主理人 | MDX |
| 站点配置（参考价、名额、官方账号） | 变化时 | 运营 | `site.config.ts` |

### 12.2 与 X 的联动

- 每条 X 复盘推文都附上对应的 `/ledger/[id]` 链接，这是官网最重要的流量引擎
- 每份档案都有一张自动生成的 **OG 档案卡**（带编号、状态印章、结案收益），在 X 上预览时就是一张「档案」
- 月度台账摘要生成一张可以直接发 X 的图

### 12.3 双语策略

- `/en` 只包含首页简版和 About。首页英文版包含：Hero、我们盯什么、台账证据条（数字相同）、情报如何产生、「The community is Chinese-speaking only for now」说明、Follow on X 按钮
- 台账和案例**不翻译**；英文页链接到中文台账，并注明「entries in Chinese」

### 12.4 迁移任务

- 把 Notion 里 50+ 条 X 复盘迁移到 `/cases`：每条保留原推链接、日期、标的、收益（**标明是最大涨幅口径**），逐条补充一句逻辑
- 把 Notion 的模块介绍改写成 8 个模块的 MDX 文件
- 把 Notion 的规则和 FAQ 改写成 `/community` 的内容（去掉攻击性措辞）

---

## 13 Technical Architecture

### 13.1 技术栈与取舍

| 层 | 选择 | 理由 | 不选什么，为什么 |
|---|---|---|---|
| 框架 | **Next.js（App Router，当前稳定版；M3 用 Context7 确认版本和 API）** | SSG、Route Handler、`next/og`、metadata API 一站解决；对 AI agent 最友好 | Astro 更轻，但 S1/S2 阶段的动态工具在 Next 里更顺 |
| 语言 | TypeScript strict | 内容 schema 和组件都有类型保护 | — |
| 样式 | Tailwind CSS（v4，把 tokens 映射到 CSS 变量） | tokens 集中管理，便于 agent 维护 | CSS-in-JS 有运行时成本 |
| 基础组件 | shadcn/ui，**只用于** Dialog、Sheet（移动菜单）、Form、Input、Select、Checkbox、Tooltip、Tabs | 可访问性有保障，源码归自己所有 | 不用它做视觉组件，档案卡、印章、窗格全部自研 |
| 动效 | CSS 优先；Motion 只用在印章、分隔线这类需要编排的地方，并按需加载 | 控制 JS 体积 | GSAP 太重，这里用不上 |
| 内容 | **MDX + Content Collections**（Zod schema 校验）；如果 M3 验证它和当前 Next 版本不兼容，退回「gray-matter + Zod + @next/mdx」自研加载器 | 类型安全，构建时校验，内容和代码同一个仓库 | 不用 headless CMS：V1 的更新量不需要，也少一个依赖 |
| 图表 | 自研 SVG 组件（数据量小、风格独特）；如果 S1 需要交互式图表，再评估 visx | 精确控制刊印风格 | Recharts 等库的默认样式很难做成刊印感 |
| 表单 | shadcn Form（react-hook-form + Zod）→ Route Handler | 同一份 Zod schema 在前后端复用 | 不用 Tally 等第三方表单：数据不经过第三方 |
| 防刷 | Cloudflare Turnstile | 免费，无感验证，隐私友好 | reCAPTCHA 在大陆无法访问 |
| 通知 | Telegram Bot API，发送到管理员的私有群 | 运营本来就在 TG 上 | 不用邮件 |
| 部署 | Vercel | 预览环境、边缘网络、零运维 | — |
| 统计 | Plausible（或自托管 Umami） | 无 cookie，无需同意弹窗，只统计事件 | GA4 太重，隐私成本也高 |
| 测试 | Vitest（schema、统计计算）+ Playwright（E2E、视觉回归）+ axe | — | — |
| 代码质量 | ESLint + Prettier（或 Biome，M3 时二选一）+ Husky pre-commit（运行 content:validate） | — | — |
| CI | GitHub Actions：typecheck → lint → content:validate → 违禁词扫描 → build → Playwright smoke | — | — |

### 13.2 渲染策略

- 全站 **SSG**：内容都在仓库里，push 到 main 分支就重新构建（通常 < 2 分钟），满足「推送后 2 小时内立案」的要求
- 唯一的动态端点：`POST /api/apply`（Route Handler，Node runtime）
- S1 阶段的公开数据模块再引入 ISR 和定时拉取

### 13.3 目录结构（建议）

```
/
├── app/
│   ├── (site)/                    中文主站
│   │   ├── page.tsx               首页
│   │   ├── ledger/ [id]/
│   │   ├── cases/ [slug]/
│   │   ├── methodology/
│   │   ├── tools/ [slug]/         使用 (tools) 窗格布局
│   │   ├── community/  about/  research/ [slug]/
│   │   ├── join/ submitted/
│   │   ├── verify/  legal/[doc]/
│   ├── en/                        英文简版
│   ├── api/apply/route.ts
│   ├── og/                        next/og 动态 OG 图
│   ├── sitemap.ts  robots.ts
├── components/
│   ├── dossier/                   CaseFile, Stamp, Redaction, Marginalia, SectionDivider
│   ├── pane/                      Pane, DataCell, StatusDot（A 系统）
│   ├── charts/                    SignalChart, Sparkline
│   ├── site/                      Nav, MobileSheet, StickyApply, Footer, RiskNote
│   └── ui/                        shadcn 组件
├── content/
│   ├── ledger/2026/IC-2026-0001.mdx
│   ├── cases/  modules/  research/  pages/
├── lib/
│   ├── schema/                    Zod schemas（唯一真相源）
│   ├── ledger/stats.ts            统计计算（有单元测试）
│   └── i18n/
├── site.config.ts                 参考价、名额、官方账号、台账起始日
├── scripts/
│   ├── new-signal.ts              pnpm new:signal → 生成立案模板
│   ├── close-signal.ts            pnpm close:signal IC-2026-0001
│   └── lint-copy.ts               违禁词扫描
└── docs/
    ├── ops/ledger-runbook.md      运营手册：如何立案、结案、作废
    └── brand.md
```

### 13.4 环境变量

`TURNSTILE_SECRET_KEY` · `NEXT_PUBLIC_TURNSTILE_SITE_KEY` · `TG_BOT_TOKEN` · `TG_ADMIN_CHAT_ID` · `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`。全部只在 Vercel 中配置，不进仓库；提供 `.env.example`。

### 13.5 中国大陆访问（已知风险）

- V1 部署在 Vercel，大陆访问可能不稳定
- **备选方案**（不在 V1 范围内）：由于全站是静态 SSG，可以 `output: 'export'` 部署到 Cloudflare Pages 作为镜像，表单端点改用 Cloudflare Worker。架构上刻意保持「只有一个动态端点」，就是为了让这次迁移成本很低
- 上线后第 2 周，根据 Plausible 的地区数据决定是否启动

---

## 14 Data / Content Architecture

### 14.1 Schemas（Zod 伪代码，是唯一真相源）

```ts
// lib/schema/signal.ts
const Status = z.enum(['open', 'hit', 'invalidated', 'stopped', 'expired', 'void']);
const Direction = z.enum(['long', 'short', 'risk-alert']);
const Chain = z.enum(['eth', 'bsc', 'base', 'sol', 'hyperliquid', 'cex']);

const Evidence = z.object({
  type: z.enum(['tg', 'tx', 'address', 'chart', 'x']),
  url: z.string().url().optional(),
  image: z.string().optional(),       // /content/assets/...
  note: z.string().optional(),
});

const SignalPublic = z.object({
  id: z.string().regex(/^IC-\d{4}-\d{4}$/),
  openedAt: z.string().datetime({ offset: true }),     // TG 推送时间
  registeredAt: z.string().datetime({ offset: true }),
  module: ModuleSlug,
  direction: Direction,
  chains: z.array(Chain).min(1),
  status: Status,
  changelog: z.array(z.object({ at: z.string(), note: z.string() })).default([]),
  commitHash: z.string().optional(),   // S1：SHA-256 承诺
});

const SignalClosed = SignalPublic.extend({
  asset: z.string(),
  entryPrice: z.number().positive(),
  targets: z.array(z.number()).optional(),
  stopLoss: z.number().optional(),
  invalidation: z.string().optional(),
  closedAt: z.string().datetime({ offset: true }),
  exitPrice: z.number().positive(),
  mfePct: z.number(),                  // 最大有利偏移
  maePct: z.number(),                  // 最大不利偏移
  closedReturnPct: z.number(),         // 按方向计算
  evidence: z.array(Evidence).min(1),
  voidReason: z.string().optional(),
});

// status = 'open' → 必须通过 SignalPublic.strict()
//   出现 asset / entryPrice 等成员字段时，构建直接失败
// status ≠ 'open' → 必须通过 SignalClosed
```

**关键安全约束**：进行中信号的成员字段**不能出现在仓库、构建产物、HTML 或 JS bundle 里**。涂黑是视觉上的占位，不是用 CSS 隐藏真实内容。`SignalPublic.strict()` 在构建时强制保证这一点，并且有单元测试覆盖。

```ts
// lib/schema/module.ts
const ModuleEntry = z.object({
  slug: z.string(), code: z.string(),              // 'M-01'
  nameZh: z.string(), nameEn: z.string(),
  category: z.enum(['derivatives', 'institutional', 'smart-money', 'onchain-behavior', 'custom', 'market']),
  status: z.enum(['member', 'beta', 'public', 'planned']),
  chains: z.array(Chain), sources: z.array(z.string()),
  frequency: z.string(), delivery: z.string(),
  url: z.string().url().optional(),                // 有了 url 就显示「打开工具」
  order: z.number(),
});

// lib/schema/case.ts
const CaseStudy = z.object({
  slug, date, asset, direction,
  metric: z.enum(['max-return', 'closed-return']),  // 历史案例 = max-return，必须标注
  valuePct: z.number(),
  xUrl: z.string().url(),
  curated: z.literal(true),                        // 永远为 true，UI 据此显示「精选」
  summary: z.string(),
});

// site.config.ts
export const site = {
  ledgerStartDate: '2026-MM-DD',
  pricing: { currency: 'BNB', plans: [{ period: 'quarter', from: 0 }, /* 待确认 */], note: '以管理员最终确认为准' },
  batch: { name: '第二批', seats: 20, reviewPerDay: 1 },
  officialChannels: [{ type: 'telegram', handle: '@gongxifacai_998', role: '入群管理员' }, /* … */],
  updatedAt: 'build-time',
};
```

### 14.2 派生数据

- `lib/ledger/stats.ts` 在构建时计算：各状态数量、结案收益中位数、平均持有天数，以及按模块、链、月份的分组统计
- 有 Vitest 单元测试（边界情况：做空方向的收益、超时结案、作废记录不计入统计）
- 编号连续性检查：发现断号时构建报警（除非对应编号有 `void` 记录）

### 14.3 运营流程（AI-agent friendly）

```
立案：pnpm new:signal --module oi-tracker --direction long --chains bsc
      → 生成 content/ledger/2026/IC-2026-00NN.mdx（只含公开字段）→ 提交并 push → 自动部署
结案：pnpm close:signal IC-2026-00NN
      → 交互式补全成员字段、证据，并计算 MFE / MAE / 收益 → 提交并 push
```

这两个脚本加上 `docs/ops/ledger-runbook.md`，让运营（或者 Claude Code、Codex）一条命令就能完成一次登记。

---

## 15 SEO

- **Metadata**：每个页面通过 `generateMetadata` 输出 title、description、canonical；title 模板为「{页面} · 0xInChain 链上情报局」
- **OG 图**：`next/og` 动态生成。档案详情用档案卡样式（编号、状态印章、收益）；案例、Research、模块各有一个模板；首页用静态品牌图
- **结构化数据（JSON-LD）**：`Organization`（sameAs 指向 X、TG）· `WebSite` · `Article`（Research）· `BreadcrumbList` · 台账列表用 `ItemList`
- **sitemap.xml / robots.txt**：自动生成；`/join/submitted` 和设计系统展示页设为 noindex
- **hreflang**：`zh-CN` ↔ `en`，仅限首页和 About 这两对页面
- **URL**：英文 slug、全小写、稳定不变（档案编号即 URL，永远不改）
- **关键词方向**：链上数据、聪明钱追踪、OI 异动、Coinbase 溢价、Hyperliquid 巨鲸、链上情报社群（长尾流量主要来自档案页和 Research）
- **X Card**：`summary_large_image`；每次上线前用 X 的卡片验证工具检查

---

## 16 Performance

| 指标 | 预算（移动端 4G 中端机） |
|---|---|
| LCP | < 2.0s |
| CLS | < 0.05 |
| INP | < 200ms |
| 首页 JS（gzip） | < 120KB |
| 首页字体首屏下载 | Latin 展示字体 ≤ 40KB（预加载）；中文字体按 unicode-range 切片按需加载 |
| 图片 | AVIF / WebP，使用 `next/image`，给出明确尺寸；柴犬档案照 ≤ 40KB |
| Lighthouse（移动） | Performance ≥ 90 · A11y ≥ 95 · Best Practices ≥ 95 · SEO 100 |

**手段**：默认使用 Server Components，客户端组件只用于菜单、表单、Tooltip 和动效岛；Motion 按需动态加载；中文衬线大字只用于标题（字形少，切片命中率高）；纸纹噪点用 CSS 或极小的平铺图，不用大图；台账列表分页（每页 50 条）；Lighthouse CI 放进 PR 检查。

---

## 17 Responsive Strategy

- **Mobile-first**，断点：`sm 640` · `md 768` · `lg 1024` · `xl 1280`；测试宽度：360 / 390 / 768 / 1024 / 1440
- **字体**：标题使用 `clamp()` 流式缩放；正文在移动端为 16px，行高 1.75
- **导航**：见 5.3（移动端抽屉 + 吸底 CTA）
- **批注栏**：`lg` 以下折叠成正文上方的一行元信息
- **台账**：`md` 以上是表格；以下是两行卡片，印章在右上角；筛选器收进底部抽屉（Sheet）
- **窗格（工具箱）**：12 栏 → 2 列 → 1 列；标题栏始终保留
- **涂黑**：hover 改为点按显示提示
- **Hero 档案卡**：移动端放正，放在 CTA 下方
- **触控目标** ≥ 44×44px；吸底条要考虑 iOS 安全区（`env(safe-area-inset-bottom)`）
- 不允许横向滚动页面（元信息行这类组件内部的横向滚动除外）

---

## 18 Accessibility

目标 **WCAG 2.2 AA**：

- 所有文字对比度 ≥ 4.5:1（大字 ≥ 3:1），M4 用工具逐个 token 实测
- **印章不能只靠颜色区分**：每个印章都有文字；台账表格的状态列同时有文字
- 涂黑：用 `aria-label="成员可见内容，已隐藏"` 并配合 `role="img"`；**不可聚焦**（M4 调整：避免给键盘用户制造没有动作的 Tab 停留点），悬停提示只是鼠标用户的补充，申请入口由旁边的 CTA 承担
- 图表：提供 `<figcaption>` 文字摘要和数据表格作为替代
- `prefers-reduced-motion`：关闭所有位移和缩放动效，只保留透明度变化或直接显示
- 键盘：全站可以用 Tab 走完；焦点可见（`--stamp` 2px outline）；移动抽屉有焦点陷阱，Esc 可以关闭
- 语义：`lang="zh-CN"` / `lang="en"`；一页一个 h1；台账用真正的 `<table>`
- 表单：有 label，错误信息和对应字段关联（`aria-describedby`），不只用颜色提示错误
- 跳转链接：「跳到主要内容」

---

## 19 Risk & Trust

| 议题 | 措施 |
|---|---|
| **战绩如何证明** | 前向全量台账；立案 ≤ 2h；每条都有 TG 时间戳证据；结案后公开链上 tx 或地址；编号连续；只能作废不能删除；修改留痕；S1 加 SHA-256 承诺 |
| **历史结果如何展示** | 放在 `/cases`，标注「精选 · 非完整记录 · 最大涨幅口径」，和台账统计分开 |
| **风险披露** | `/legal/risk` 全文；每页 footer 有摘要；每份档案有固定风险提示；`/join` 表单必须勾选「我已阅读风险披露」 |
| **不保证收益** | 违禁词 CI 扫描；文案规范（第 02 节）；不做收益承诺；不放「胜率」大数字 |
| **数据来源** | 方法论页和模块详情页列出所有数据源（CoinGlass Pro 等），以及每个数据源的局限 |
| **更新时间** | footer 显示「台账最后更新」时间；每份档案有登记时间和结案时间；每个模块有「最后校验」日期 |
| **结果能否验证** | 结案后可以核对链上 tx 和地址；TG 截图带时间；X 推文有时间戳；S1 用哈希做加密承诺 |
| **隐私** | 申请表只收：TG handle（必填）、交易年限、主要市场、了解渠道、关注的模块、资金区间（可选、区间式）。**不收**钱包地址、真实姓名、证件。数据只发到管理员的 TG，站点不存储，服务端日志不记录请求体。统计工具不用 cookie。`/legal/privacy` 写明这些 |
| **外链安全** | 所有外链 `rel="noopener noreferrer"`；外链只指向官方账号（集中在 `site.config.ts` 的 `officialChannels`，不在代码里散落硬编码）；CI 做链接检查 |
| **防冒充 / 防诈骗** | `/verify` 页列出**唯一合法**的 TG、X 账号（附头像截图和数字 ID）；全站 footer 和 `/join/submitted` 声明：「除了回复你的申请，管理员不会主动私信你」「付款前请在 /verify 核对账号」「任何索要私钥、助记词的都是骗子」；**建议**在 `/verify` 公示官方收款地址，让付款前可以交叉核对（见附录 B） |
| **不退款政策** | 写在明处（`/join`、`/community`、`/legal/terms`），不藏在小字里 |
| **避免像诈骗页** | 不做倒计时，不写「最后名额」，不放收益截图墙，不用红色警报；价格公开；主理人档案可查；深色、克制的编辑式设计本身就在建立信任 |
| **地区** | V1 不做地区屏蔽；风险披露里说明「用户需自行确认所在地区法律是否允许」 |

---

## 20 Analytics

**工具**：Plausible（无 cookie，无需同意弹窗）。

**事件**：

| 事件 | 属性 |
|---|---|
| `cta_apply_click` | `location`（nav / hero / sticky / join-section / redaction / ledger-detail） |
| `ledger_view` / `ledger_entry_view` | `id`, `status` |
| `ledger_filter` | `key`, `value` |
| `case_view` · `module_view` · `research_view` | `slug` |
| `methodology_view` | — |
| `redaction_reveal` | `location`（涂黑提示被触发，代表付费兴趣） |
| `outbound_x` · `outbound_tg` | `location` |
| `apply_form_start` · `apply_form_submit` · `apply_form_success` · `apply_form_error` | `error_type` |
| `verify_view` | — |
| `lang_switch` | `to` |

**UTM 规范**：X 推文 `?utm_source=x&utm_medium=social&utm_campaign=ledger-IC-2026-00NN`；Linktree 用 `utm_source=linktree`。

**核心看板**：访问 → 台账浏览 → `/join` 浏览 → 表单开始 → 表单提交；按来源和落地页拆分；每月复盘一次，和月度台账摘要一起做。

---

## 21 Development Milestones

> 原则：每个 Milestone 都可以由 Claude Code 或 Codex **单独一次完成**；都有明确的验收标准；依赖关系清楚。M6 拆成 M6a 和 M6b 以控制规模。

### M0 Research ✅
- **Goal**：理解品牌、参考站和用户，达成决策共识
- **Tasks**：分析 Linktree、Notion、X；实测审计两个参考站；完成 Q1–Q23 访谈
- **Deliverables**：本文档 `WEBSITE_PLAN.md`
- **Acceptance Criteria**：23 节齐全；决策记录完整；待确认事项列出
- **Verification**：用户确认本 Plan
- **Dependencies**：无

### M1 Brand & Design Direction ✅（2026-09-29，交付说明见 `design/README.md`）
- **Goal**：把品牌和视觉方向固化成可执行的规范
- **Tasks**：
  1. 写 `docs/brand.md`：名称写法、一句话定位（中英）、语气规范、违禁词清单、柴犬使用规则
  2. 设计 V1 wordmark：纯字体 SVG，包含「0xInChain」横版、「0xInChain 链上情报局」组合版、favicon 版
  3. 输出 `design/tokens.json`：颜色、字体、字号、间距、圆角、动效时长
  4. 做 3 张关键画面的**静态 HTML 视觉稿**（放在 `design/mockups/`，不进入应用代码）：首页 Hero、台账档案卡加印章加涂黑、工具箱窗格
- **Deliverables**：`docs/brand.md`、`design/wordmark/*.svg`、`design/tokens.json`、`design/mockups/*.html`
- **Acceptance Criteria**：3 张视觉稿在桌面和移动端都能打开；所有颜色组合实测对比度达到 AA；wordmark 在 16px favicon 尺寸下仍可辨认
- **Verification**：浏览器截图（1440 和 390 两个宽度）交给用户确认；对比度工具输出报告
- **Dependencies**：M0

### M2 Information Architecture ✅ 初稿完成（2026-09-29，待用户审阅文案；占位符汇总在 `docs/open-items.md`）
- **Goal**：锁定页面、内容和文案，让后续开发不用再做内容决策
- **Tasks**：
  1. 为每个路由写低保真线框（Markdown 区块清单即可）
  2. 写首页全部文案初稿（中文）和 `/en` 首页文案
  3. 写 `/community`、`/join`、`/verify`、`/methodology`、`/legal/*` 的文案初稿
  4. 最终确定 Zod schemas（第 14 节），写成 `docs/content-model.md`
  5. 内容清单：8 个模块的字段表，50+ 条案例的迁移表（CSV）
- **Deliverables**：`docs/ia/*.md`、`docs/copy/*.md`、`docs/content-model.md`、`docs/migration/cases.csv`
- **Acceptance Criteria**：每个路由都有线框和文案；文案通过违禁词清单的人工检查；案例 CSV 覆盖 Notion 中的全部条目
- **Verification**：用户审阅文案；逐条核对 CSV 和 Notion
- **Dependencies**：M1（语气规范）；附录 B 中的参考价、官方账号、台账起始日

### M3 Foundation ✅（2026-09-29，本地完成；Vercel 预览需要用户推送 GitHub 并导入，见 README「部署」）
- **Goal**：可以部署的空壳，工程规范就位
- **Tasks**：
  1. 用 Context7 确认 Next.js、Tailwind、Content Collections 的当前版本和 API
  2. 初始化 Next.js（TS strict、App Router）、Tailwind、ESLint/Prettier（或 Biome）、Husky
  3. 实现第 13.3 节的目录骨架，所有路由先放占位页
  4. 接入 Content Collections 和第 14 节的 schemas；准备 3 条示例档案（open、hit、stopped 各一），确认 open 档案带成员字段时构建失败
  5. 用 `next/font` 配置字体
  6. CI：typecheck → lint → content:validate → build
  7. 连接 Vercel，开启预览部署
- **Deliverables**：可以运行的仓库、Vercel 预览 URL、`.env.example`、`README.md`
- **Acceptance Criteria**：`pnpm build` 通过；所有路由返回 200；故意在 open 档案里加入 `asset` 字段时构建失败；CI 通过
- **Verification**：CI 日志；访问预览 URL；负向测试（open 档案泄露字段）的截图
- **Dependencies**：M2（schemas）

### M4 Design System ✅（2026-09-29；与原计划的差异：不引入 shadcn/ui，移动菜单用原生 `<dialog>`；展示页路由为 `/design-system`，因为 Next 会忽略下划线开头的 `/_design`；涂黑条不可聚焦，见第 18 节）
- **Goal**：把 tokens 和核心组件实现出来，后续页面只做组装
- **Tasks**：
  1. tokens → Tailwind theme / CSS 变量
  2. 档案组件：`CaseFile`、`Stamp`（6 种状态）、`Redaction`、`Marginalia`、`SectionDivider`
  3. 窗格组件：`Pane`、`DataCell`、`StatusDot`
  4. 站点组件：`Nav`、`MobileSheet`、`StickyApply`、`Footer`、`RiskNote`、`Button`（3 种）
  5. 图表组件：`SignalChart`（入场、峰值、结案三点加批注）、`Sparkline`
  6. 引入 shadcn：Dialog、Sheet、Form、Input、Select、Checkbox、Tooltip、Tabs，并按 tokens 重新配色
  7. 设计系统展示页 `/_design`（noindex，生产环境隐藏）
  8. 处理柴犬素材（透明高清原图 → AVIF/WebP）
- **Deliverables**：`components/**`、`/_design` 展示页
- **Acceptance Criteria**：展示页覆盖每个组件的所有状态；axe 零严重问题；键盘可操作；`Redaction` 的 DOM 中没有真实内容
- **Verification**：Playwright 对 `/_design` 截图作为视觉回归基线；运行 axe 报告
- **Dependencies**：M1、M3；**柴犬透明高清原图**（没有的话先用占位图，不阻塞）

### M5 Homepage ✅（2026-09-29；8 个模块的内容文件已提前在 M5 生成，M8 直接复用；Hero「最新结案」按结案时间而非编号选取）
- **Goal**：完成第 06 节的全部区块
- **Tasks**：按 ②–⑭ 的顺序实现；证据条和最新台账从内容层读取（使用 M3 的示例档案）；Hero 档案卡自动选择最新一份已结案档案；Research 区块在没有内容时隐藏
- **Deliverables**：`app/(site)/page.tsx` 及各区块组件
- **Acceptance Criteria**：5 秒测试的要素都在首屏；所有 CTA 指向正确；统计数字和内容层一致；不包含 M11 的动效（先做静态版本）
- **Verification**：1440 和 390 两个宽度的截图；链接检查；5 人快速 5 秒测试（可以放到 M13 做）
- **Dependencies**：M4

### M6a Community Performance · Ledger ✅（2026-09-29；A7 已实现：结案脚本从币安公开行情拉取 K 线；筛选用原生下拉框而非芯片按钮加底部抽屉）
- **Goal**：信号台账可以使用，并且能自证可信
- **Tasks**：
  1. `/ledger`：统计头部、筛选（模块、链、方向、状态、月份）、表格/卡片的响应式切换、分页
  2. `/ledger/[id]`：完整档案、图表、证据、changelog、风险提示、底部品牌区块和 CTA
  3. `lib/ledger/stats.ts` 及其单元测试；编号连续性检查
  4. `scripts/new-signal.ts`、`scripts/close-signal.ts`，以及 `docs/ops/ledger-runbook.md`
  5. 档案的 OG 图模板
- **Deliverables**：上述路由、脚本、运营手册
- **Acceptance Criteria**：open 档案正确显示涂黑；统计结果符合单元测试（包括做空、超时、作废的情况）；脚本能在 1 分钟内完成一次立案；OG 图可以正常渲染
- **Verification**：Vitest 通过；按运营手册完整跑一遍立案 → 结案；X 卡片验证工具预览 OG 图
- **Dependencies**：M4、M5

### M6b Community Performance · Cases & Methodology ✅（2026-09-29；导入 54 条案例：$BNC 按 A6 不迁移，全部标注「未核验」；方法论页用 TSX 编写而非 MDX）
- **Goal**：历史案例迁移完成，方法论公开
- **Tasks**：`/cases`、`/cases/[slug]`（带「精选」标识，标注最大涨幅口径）；按 M2 的 CSV 迁移 50+ 条案例；`/methodology`（登记规则、结案规则、收益口径、证据类型、局限性）；案例的 OG 图模板
- **Deliverables**：路由和全部案例的 MDX
- **Acceptance Criteria**：每个案例都有原推链接和「精选」标识；案例数据不计入台账统计（有单元测试断言）；方法论覆盖第 08 节的全部规则
- **Verification**：抽查 10 条案例和原推是否一致；检查统计隔离的测试
- **Dependencies**：M6a

### M7 Community, About & EN ✅（2026-09-29；缺失信息统一显示「待补充」：主理人代号 / 入行年份、大事记、续费与币种 FAQ——对应 B4–B6、A3；/research 目前为空状态；EN 页头不显示申请 CTA，改为 Follow on X）
- **Goal**：完成转化前的深度了解页，以及英文门面
- **Tasks**：`/community`（第 9.1 节）、`/about`（第 9.2 节）、`/research` 列表和详情模板、`/en`、`/en/about`、语言切换
- **Deliverables**：路由和内容
- **Acceptance Criteria**：文案通过违禁词扫描；hreflang 正确；英文页明确说明「社群只服务中文用户」
- **Verification**：截图；hreflang 检查
- **Dependencies**：M4、M2（文案）

### M8 Toolbox ✅（2026-09-30；模块新增 `why` 字段承载「为什么重要」；分类 + 状态筛选存 URL；`toolActions` / `accessFor` 单测断言有 url 即出现「打开工具」；4 个规划中模块按 A5 标记 demo，待确认）
- **Goal**：工具箱以 A 窗格系统上线
- **Tasks**：`(tools)` 布局；`/tools`（分类加状态筛选，窗格网格）；`/tools/[slug]`（第 10.3 节）；8 个模块的 MDX；「关联台账 N 份」计数；`url` 字段存在时显示「打开工具」按钮
- **Deliverables**：路由和 8 个模块内容
- **Acceptance Criteria**：8 个模块都有完整详情；给某个模块加上 `url` 后卡片自动出现按钮（用测试断言）；视觉上和主站同一套色板，不割裂
- **Verification**：截图；单元测试
- **Dependencies**：M4、M6a（关联台账计数）

### M9 Join Flow
- **Goal**：转化闭环可以使用，防骗机制就位
- **Tasks**：
  1. `/join`：流程、参考价（读取 `site.config`）、名额、规则、表单
  2. 表单：Zod schema 前后端复用；风险披露勾选框；Turnstile
  3. `POST /api/apply`：校验 → Turnstile 验证 → 发送到 TG Bot 管理员群 → 返回结果；不记录请求体；失败时给出友好提示并提供 TG 备用方式
  4. `/join/submitted`：下一步说明、防骗提醒、柴犬探员
  5. `/verify`、`/legal/risk`、`/legal/privacy`、`/legal/terms`
- **Deliverables**：路由、Route Handler、法律页面
- **Acceptance Criteria**：在预览环境提交后，60 秒内 TG 收到格式化的消息；Turnstile 失败时拒绝请求；非法输入返回 400；服务端日志中没有申请内容
- **Verification**：Playwright E2E（用 Turnstile 测试 key 加模拟的 TG 端点）；在预览环境人工提交一次，确认真实送达
- **Dependencies**：M4；TG Bot 的 token 和管理员 chat ID；Turnstile 的 key

### M10 Responsive
- **Goal**：所有页面在 5 个宽度下都达标
- **Tasks**：在 360 / 390 / 768 / 1024 / 1440 宽度逐页检查；修复问题；吸底 CTA 和安全区；台账和窗格的响应式细节；触控目标检查
- **Deliverables**：修复记录、各宽度截图集
- **Acceptance Criteria**：没有页面级横向滚动；触控目标 ≥ 44px；第 17 节的每一条都满足
- **Verification**：Playwright 多视口截图；真机抽测（iOS Safari、Android Chrome）
- **Dependencies**：M5–M9

### M11 Motion
- **Goal**：实现第 11.7 节的动效清单
- **Tasks**：分隔线画出、印章盖下、台账逐行打印、涂黑刷上、数字滚动、hover 反馈；全部支持 `prefers-reduced-motion`；Motion 按需加载
- **Deliverables**：动效实现
- **Acceptance Criteria**：没有阻塞可读性的动画（首屏文字在第一帧可见）；开启减少动效后没有位移动画；首页 JS 仍然在 120KB 预算内
- **Verification**：Playwright 分别在两种动效设置下截图；bundle 分析报告
- **Dependencies**：M10

### M12 SEO & Performance
- **Goal**：可以被搜索引擎收录、可以被 X 传播、速度达标
- **Tasks**：metadata、canonical、OG 图全覆盖；JSON-LD；sitemap 和 robots；hreflang；Lighthouse CI；字体和图片优化；按第 16 节的预算调优
- **Deliverables**：SEO 配置、Lighthouse 报告
- **Acceptance Criteria**：移动端 Lighthouse 达到第 16 节的数值；结构化数据验证零错误；X 卡片预览正确
- **Verification**：Lighthouse CI 报告；Rich Results Test；X 卡片验证工具
- **Dependencies**：M11

### M13 QA
- **Goal**：上线前的全面质量关卡
- **Tasks**：按第 22 节执行：E2E、可访问性、视觉回归、跨浏览器、内容校对、违禁词扫描、链接检查；5 人 5 秒测试
- **Deliverables**：`docs/qa/report.md`（问题清单和修复状态）
- **Acceptance Criteria**：P0 和 P1 问题清零；第 22 节的全部检查通过
- **Verification**：CI 全绿；QA 报告交给用户签字
- **Dependencies**：M12

### M14 Launch
- **Goal**：正式上线，台账开始计时
- **Tasks**：按第 23 节执行
- **Deliverables**：生产环境站点、上线记录
- **Acceptance Criteria**：生产域名可以访问（HTTPS）；生产环境的表单能送达 TG；统计开始收数；**台账起始日写入 `site.config`，第一份档案登记完成**
- **Verification**：生产环境冒烟测试；从 X 发出第一条带深链的推文
- **Dependencies**：M13；域名

---

## 22 QA

| 类别 | 工具 / 方法 | 通过标准 |
|---|---|---|
| 内容 schema | `content:validate`（Zod） | 0 错误；open 档案没有泄露字段 |
| 统计正确性 | Vitest | 全部通过，覆盖做空、超时、作废、案例隔离 |
| 违禁词 | `scripts/lint-copy.ts`（扫描 content、docs/copy、组件中的字符串） | 0 命中（白名单除外） |
| E2E | Playwright：首页 → 台账 → 档案详情 → 申请提交；移动菜单；语言切换；筛选 | 全部通过 |
| 视觉回归 | Playwright 截图（`/_design` 和关键页面，1440 / 390 两个宽度） | 差异都经过人工确认 |
| 可访问性 | axe（Playwright 集成）+ 键盘手动走查 + VoiceOver 抽查 | 0 严重、0 高危问题 |
| 性能 | Lighthouse CI | 达到第 16 节预算 |
| 链接 | lychee（或同类工具） | 0 死链；外链只指向官方账号 |
| 跨浏览器 | Chrome、Safari、Firefox 最新版；iOS Safari 17+；Android Chrome | 功能和视觉一致 |
| 表单安全 | 负向测试：缺少 Turnstile、超长输入、脚本注入、频繁提交 | 全部被正确拒绝；TG 消息做了转义 |
| 可用性 | 5 人 5 秒测试（目标用户画像） | ≥ 4 人能答对「是谁、做什么、下一步」 |
| 内容 | 人工校对：错别字、中英文混排空格、数字格式、时间时区 | 0 问题 |

---

## 23 Launch

### 23.1 上线前（T−7 到 T−1）
- [ ] 域名注册或配置，DNS、HTTPS
- [ ] 在 Vercel 生产环境配置环境变量
- [ ] 创建生产环境的 TG Bot 管理员群并测试送达
- [ ] 申请生产环境的 Turnstile key
- [ ] Plausible 站点配置和事件目标
- [ ] 最终确认 `site.config`：参考价、名额、官方账号、**台账起始日**
- [ ] `/verify` 页的账号截图和数字 ID 与实际一致
- [ ] 同步更新 Linktree（加官网链接、统一写法）、X bio、Notion 顶部（加官网链接）
- [ ] 准备回滚方案：Vercel Instant Rollback

### 23.2 上线日（T0）
- [ ] 部署到生产环境，冒烟测试（首页、台账、详情、申请提交、`/verify`）
- [ ] 登记第一份台账档案（台账计时开始）
- [ ] X 发布上线推文（附台账深链和 UTM）
- [ ] 在 TG 公开频道和成员群公告

### 23.3 上线后（T+1 到 T+14）
- 每天：检查申请送达情况、错误日志、台账是否按时立案和结案
- T+7：第一次看漏斗数据，调整 CTA 或文案
- T+14：决定是否启动 Cloudflare 镜像（参考大陆访问比例）
- T+30：发布第一份月度台账摘要

### 23.4 上线后的待办（按优先级）
1. SHA-256 哈希承诺（Q21-C）
2. 工具箱 S1：1 个公开延迟模块（Q14-C）
3. Cloudflare Pages 大陆镜像
4. 浅色模式
5. 英文版扩展

---

## 附录 A · 决策记录

| # | 问题 | 决定 |
|---|---|---|
| Q1 | 核心目标 | 品牌为主，付费转化为副，工具作为长期方向 |
| Q2 | 品牌资产 | 没有，在规划中一起制定 |
| Q3 | 战绩数据 | 只有精选的成功案例（50+ 条 X 复盘） |
| Q4 | 加入流程 | 邀请制申请 |
| Q5 | 工具现状 | 没有网页工具（但有 8 个 TG 监控模块） |
| Q6 | 语言 | 中文为主，英文简版 |
| Q7 | 内容节奏 | 战绩持续更新，每月 1–2 篇 Research，使用 MDX |
| Q8 | 合规 | 不做任何收益承诺 |
| Q9 | 社群介绍深度 | 首页做中等深度，另设 `/about` |
| Q10 | 技术 | Next.js + Vercel 默认组合 |
| Q11 | 战绩承诺 | 前向全量台账，历史部分只作为精选案例 |
| Q12 | 价格 | 公开起步参考价和周期 |
| Q13 | 申请通道 | 站内表单 → TG Bot，加 `/verify` 页 |
| Q14 | 工具箱 | 展示现有模块（S1 再做公开模块） |
| Q15 | 品牌名 | 0xInChain 为主名，链上情报局为副名，V1 用纯字体 wordmark |
| Q16 | 主理人 | 化名出场 |
| Q17 | 英文路由 | `/en` 路径 |
| Q18 | 0xRouter.app | 官网不提 |
| Q19 | 名额 | 如实、克制地展示 |
| Q20 | 视觉 | B 情报档案为主体，工具箱用 A 的窗格系统 |
| Q21 | 台账公开时机 | 即时登记 + 涂黑，结案后全部公开 |
| Q22 | 收益口径 | 最大涨幅和结案收益同时展示，统计默认用结案收益 |
| Q23 | 柴犬探员 | 档案照 + 在情绪节点克制使用；禁用奖杯、皇冠和节日主题 |

## 附录 B · 待确认事项（不阻塞 M1，但阻塞对应的 Milestone）

| 事项 | 阻塞 | 负责人 |
|---|---|---|
| 柴犬角色是否就是主理人现在的 X 头像或固定人设 | M4 | 客户 |
| 柴犬素材的透明高清原图（没有 AI 水印） | M4 | 客户 |
| 主理人代号、专长、入行时长、「为什么做」 | M2 | 客户 |
| 各周期的起步参考价（BNB） | M2 | 客户 |
| 官方账号完整清单（TG、X，附数字 ID） | M2 | 客户 |
| 是否有 TG 公开频道（Linktree 上的 @0xInchain Telegram 是频道还是个人账号） | M2 | 客户 |
| 是否在 `/verify` 公示官方收款地址 | M9 | 客户 |
| 域名 | M14 | 客户 |
| 台账起始日（建议等于上线日） | M14 | 客户 |
| 统一各平台的品牌写法（Linktree、Notion、X 显示名） | M14 | 客户 |
| 客户是否接受把「付费加入」改为「申请加入」 | M5 | 客户 |

## 附录 C · 未选中的视觉方向（存档）

- **A · Signal Desk 交易台**：近黑底、琥珀色 #FFB020、Martian Mono、12 栏窗格、终端式高密度。**窗格系统已被工具箱采用**
- **C · Flow Atlas 资金流航图**：深海底、荧光青和珊瑚红表示流向、Archivo Expanded 宽体、生成式资金流线 Canvas。视觉冲击力最强，但工程和性能成本最高，且依赖真实数据源。可以作为工具箱 S2 以后的数据可视化语言再做评估
