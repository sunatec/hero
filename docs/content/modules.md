# 模块内容初稿 v1（M2）

> 来源：Notion 各模块的介绍原文。改写原则：保留事实（数据源、覆盖范围、频率、交付方式），去掉「最无解」「大幅提升胜率」「抢跑」这类夸张表述；每个模块补写「局限性」。
> M8 把每个模块拆成 `content/modules/{slug}.mdx`，字段遵循 `docs/content-model.md` 第 3 节。
> 样例中的 `▇{n}` 表示涂黑（n 为字符宽度），真实内容不写入仓库。

---

## M-01 · OI 异动预警 · Elite OI Tracker
- **slug** `oi-tracker` · **category** derivatives · **status** member
- **tagline**：价格会骗人，持仓量的变化更难伪装。
- **sources**：CoinGlass Pro API（每分钟 1200 次调用，160+ 数据端点）
- **chains**：cex · **frequency**：5 分钟 / 15 分钟级别 · **delivery**：TG 成员频道
- **它是什么**：监控主流交易所永续合约的持仓量（OI）变化，在 5 分钟、15 分钟级别发现异常放量，并区分真实的增量资金和洗盘噪音。
- **为什么重要**：价格波动可以被少量资金制造，但持仓量的大幅增加意味着真金白银在进场。OI 与价格、现货成交量同步放大时，行情往往更有持续性。
- **局限性**：
  - OI 增加不区分多空，需要结合资金费率和价格方向判断
  - 小市值合约的 OI 容易被单一大户扭曲
  - 行情剧烈时 API 数据可能有秒级延迟
- **样例**：`09:12 ▲ OI +14.2% / 1h · ▇{5} · 资金费率 ▇{6}`

## M-02 · Coinbase 溢价监测 · Institutional Heatmap
- **slug** `coinbase-premium` · **category** institutional · **status** member
- **tagline**：散户看涨跌，机构看溢价。
- **sources**：Coinbase 与 Binance 的 BTC 现货价格
- **chains**：cex · **frequency**：每小时 · **delivery**：TG 成员频道
- **它是什么**：实时计算 Coinbase BTC 与 Binance BTC 之间的价差。Coinbase 价格更高，通常意味着美国时段的机构和大户在买入。
- **为什么重要**：溢价持续为正，是判断行情由美盘资金推动的重要依据；溢价由正转负或急剧收窄，往往预示买盘动能减弱，可以作为减仓或风险预警的参考。
- **局限性**：
  - 溢价是结果而不是原因，单独使用滞后性明显
  - 在两家交易所出现流动性事件时，溢价可能失真
  - 目前只覆盖 BTC
- **样例**：`14:00 BTC 溢价率 0.062% · 过去 6h ▇{8}`

## M-03 · 全链聪明钱雷达 · Multi-Chain Alpha Radar
- **slug** `smart-money-radar` · **category** smart-money · **status** member
- **tagline**：原始数据只是杂讯，解析后的流向才是信号。
- **sources**：BSC、BASE、ETH、SOL 四链的自有数据解析 · 自建地址标签库
- **chains**：bsc · base · eth · sol · **frequency**：全天扫描 · **delivery**：TG 成员频道
- **它是什么**：扫描四条公链上的大额交互（DEX 流动性变化、合约部署、大户地址交互），剔除刷量和对敲，把关联钱包归为同一实体，追踪被标注为聪明钱的地址在链间的资金流转，并计算核心地址的建仓成本。
- **为什么重要**：聪明钱通常分散在多个钱包里建仓。单看一个地址看不出什么，归为一个集群之后，建仓节奏和成本区就清楚了。
- **局限性**：
  - 地址标签和集群归类是基于历史行为的推断，可能出错
  - 主力发现地址被追踪后会更换地址，标签会失效
  - 这也是我们限制成员规模、禁止转发的原因
- **样例**：`10:02 BASE · 集群 ▇{8} 共 6 地址 · 过去 3h 累计买入 ▇{7} · 均价 ▇{6}`

## M-04 · Hyperliquid 聪明钱雷达 · Early Alpha Radar
- **slug** `hyperliquid-radar` · **category** smart-money · **status** member
- **tagline**：不提供跟单信号，提供比市场更早的观察视角。
- **sources**：Hyperliquid 公开订单与持仓数据 · 自建地址标签
- **chains**：hyperliquid · **frequency**：实时 · **delivery**：TG 成员频道
- **它是什么**：追踪 Hyperliquid 上历史表现突出的钱包（例如一组被标注为长期做空的地址），同步它们的加仓、减仓和持仓价值。
- **为什么重要**：当多个同类地址同时减仓，往往比技术指标更早反映出一方力量的衰竭；观察千万美元级账户在关键价位的选择，可以帮你判断突破的真假。
- **局限性**：
  - 地址的历史表现不代表未来，大户也会犯错或故意示弱
  - 我们只看到链上可见的仓位，看不到他们在其他平台的对冲
  - 这是观察工具，不建议机械跟单
- **样例**：`21:05 LONG ▇{5} · size ▇{6} · 地址标签：▇{6}`

## M-05 · 智能 HYPE 巨鲸监控 · HYPE Whale Watcher
- **slug** `hype-whale-watcher` · **category** smart-money · **status** beta
- **tagline**：在链上衍生品战场，看清巨鲸的每一次重仓。
- **sources**：Hyperliquid 公开数据 · 自研地址评分模型
- **chains**：hyperliquid · **frequency**：实时 · **delivery**：TG 成员频道（测试期）
- **它是什么**：推送 Hyperliquid 上的大额开多、开空，显示均价、仓位、杠杆倍数，并给每个地址算出胜率、评分和总盈亏，标出「新钱包」这类风险提示。
- **为什么重要**：区分有历史参考价值的老牌巨鲸和一次性的高风险头寸，帮你判断当前行情是主力看好的突破前夜，还是过度杠杆的风险区。
- **局限性**：
  - 测试期内评分模型仍在调整，可能出现误判
  - 新钱包无法评分，只能提示风险
  - 高杠杆仓位的持有时间很短，推送到你看到之间可能已经变化
- **样例**：`巨鲸开多 ▇{6} BTC · 杠杆 ▇{3} · 地址评分 ▇{4} · 新钱包：否`

## M-06 · EVM 资产统计 · KOL Asset Tracker
- **slug** `kol-asset-tracker` · **category** smart-money · **status** beta
- **tagline**：别只看他们说了什么，看他们在链上做了什么。
- **sources**：EVM 链上数据 · 公开的 KOL 钱包地址
- **chains**：【待确认：Notion 只写了「EVM」】 · **frequency**：实时 · **delivery**：TG 成员频道（测试期）
- **它是什么**：统计知名 KOL 和深度玩家公开钱包的大额资产变动，包括增持、清仓，以及当前持仓数量和价值。
- **为什么重要**：社交媒体上的观点可能滞后或带有倾向，链上变动更诚实。当多位 KOL 同时减持某一类资产，往往比技术指标更早提示局部泡沫。
- **局限性**：
  - 只覆盖公开或已被识别的地址，KOL 可能使用其他钱包
  - 转账不等于买卖（可能是内部调拨）
  - 用于监控，不建议跟单
- **样例**：`KOL ▇{6} 增持 ▇{6} · 当前持仓价值 ▇{6}`

## M-07 · JUP DCA 深度解析 · Jupiter DCA Intelligence
- **slug** `jup-dca` · **category** onchain-behavior · **status** member
- **tagline**：看清主力的定投计划，找到真实的筹码收集区。
- **sources**：Solana 链上 Jupiter DCA 订单
- **chains**：sol · **frequency**：实时 · **delivery**：TG 成员频道
- **它是什么**：还原 Solana 上大额 DCA（分批定投）订单的全貌：总金额、执行次数、预计完成时间、价格条件，以及发起地址的钱包余额。
- **为什么重要**：巨鲸在 Solana 上大额交易时，常用 DCA 来降低滑点。多个大户同时开启长周期定投，往往意味着该币种进入长线吸筹区；反向的大额 DCA 卖出则可能是悄悄出货。
- **局限性**：
  - 订单可以随时取消，计划不等于最终执行
  - 只覆盖 Jupiter DCA，看不到其他分批卖出的方式
- **样例**：`▇{8} → USDC · 分 700 次执行 · 预计 ▇{3} 天完成 · 钱包余额 ▇{6}`

## M-08 · 币种链上情报申请 · On-Demand Token Analysis
- **slug** `custom-intel` · **category** custom · **status** member
- **tagline**：你关注的币种，由我们来解析。
- **sources**：以上全部模块的数据与工具
- **chains**：视币种而定 · **frequency**：按需 · **delivery**：成员群内回复；具有普遍价值的分析会在群内公开
- **它是什么**：成员可以申请对某个币种做一次深度分析：筹码分布、大户成本区、聪明钱建仓均价、早期地址和锁仓情况。另外，每位成员可以指定一个重点币种，由系统单独监控。
- **为什么重要**：自动监控覆盖不到的标的，可以通过人工分析补足。
- **局限性**：
  - 分析需要时间，排队顺序以申请先后为准【待确认：时效】
  - 新币或流动性极低的币种，可分析的数据可能不足
- **样例**：`申请标的 ▇{5} · 大户成本区 ▇{9} · 结论 ▇{12}`

---

## 规划中（P）

| code | slug | 名称 | 类别 | 说明 |
|---|---|---|---|---|
| P-01 | funding-rate | 资金费率看板 · Funding Rate Board | derivatives | 多交易所资金费率对比与异常提醒 |
| P-02 | liquidation-map | 清算热图 · Liquidation Map | derivatives | 主要价位的清算密集区 |
| P-03 | token-search | 代币链上检索 · Token Search | market | 输入代币，查看持仓分布与聪明钱动向 |
| P-04 | market-dashboard | 市场总览 · Market Dashboard | market | 把以上信号汇总成一页 |

> 规划中模块是否全部展示，以及展示顺序，由主理人决定。只展示有真实计划的模块，避免空头支票。
