# 台账运营手册（M6a）

> 适用对象：运营人员，或者代为操作的 Claude Code / Codex。
> 规则来源：`docs/copy/ledger.md`（方法论）、`docs/content-model.md` 第 1 节。
> 所有命令都在仓库根目录执行。时间一律写成 UTC+8，格式 `2026-10-14T10:02:00+08:00`。

## 什么需要登记

只登记**带明确方向的交易信号**：实战操作播报中的建仓，以及明确的风险预警。模块自动推送的原始异动（一次 OI 变化、一笔巨鲸转账）**不登记**。同一标的在持有期内的加仓、减仓，写进同一份档案的修改记录，不另开新档案。

## 1. 立案（推送后 2 小时内）

```bash
pnpm new:signal --module oi-tracker --direction long --chains bsc,base --opened-at 2026-10-14T10:02:00+08:00
```

| 参数 | 说明 |
|---|---|
| `--module` | 模块 slug：oi-tracker · coinbase-premium · smart-money-radar · hyperliquid-radar · hype-whale-watcher · kol-asset-tracker · jup-dca · custom-intel |
| `--direction` | long · short · risk-alert |
| `--chains` | 逗号分隔：eth · bsc · base · sol · hyperliquid · cex · other |
| `--opened-at` | 信号推送到成员频道的时间。省略时等于当前时间 |

脚本会：
- 自动分配下一个编号（按立案年份，编号连续）
- 把登记时间 `registeredAt` 写成当前时间
- **只写公开字段**。标的、价格、依据这些成员字段不会、也不允许出现在进行中的档案里

然后提交并推送：

```bash
git add content/ledger && git commit -m "Register IC-2026-0004" && git push
```

> 登记时间晚于立案时间 2 小时以上，页面会显示「延迟登记」。这不会阻止发布，但请尽量避免。

## 2. 结案（结案后 24 小时内）

先把证据截图放进 `public/ledger/{编号}/`，例如 `public/ledger/IC-2026-0004/tg.webp`。

```bash
pnpm close:signal IC-2026-0004 \
  --status hit --asset '$ARB' --entry 0.412 --exit 0.455 \
  --closed-at 2026-10-16T09:00:00+08:00 \
  --targets 0.455 --stop 0.39 --invalidation '现货成交量未跟随 OI 放大' \
  --evidence tg:/ledger/IC-2026-0004/tg.webp \
  --evidence x:https://x.com/0xInChain/status/…
```

| 参数 | 必填 | 说明 |
|---|---|---|
| `--status` | ✓ | hit（命中）· invalidated（失效）· stopped（止损）· expired（超时） |
| `--asset` | ✓ | `$` 加代码，记得用单引号包起来，否则 shell 会把 `$ARB` 当成变量 |
| `--entry` / `--exit` | ✓ | 入场价 / 结案价 |
| `--closed-at` | ✓ | 结案时间 |
| `--evidence` | ✓ | `类型:值`，可以重复。类型：tg · tx · address · chart · x；值为 URL，或 `public/` 下的图片路径 |
| `--targets` `--stop` `--invalidation` | | 立案时预设的目标、止损、失效条件 |
| `--x-url` | | 对应的 X 复盘推文 |
| `--symbol` | | 交易对和 `$ASSET` + USDT 不一致时指定，例如 `--symbol 1000PEPEUSDT` |
| `--no-series` | | 不拉取行情 |

脚本会：
1. 从币安公开行情接口拉取持有期的 K 线（先用 `data-api.binance.vision`，失败再用 `api.binance.com`；自动走系统代理）
2. 用 K 线的最高价和最低价计算**最大涨幅**和**最大回撤**，并保证 `最大回撤 ≤ 结案收益 ≤ 最大涨幅`
3. 按方向计算**结案收益**（风险预警按预警后的跌幅计算）
4. 用与构建完全相同的校验规则检查结果，**不通过就不写入文件**
5. 在正文里留下两处 `【待填写】`：依据、复盘

**写完依据和复盘再推送。**正文里还留着 `【待填写】` 时，开发环境只给警告，生产构建会直接失败。

> 拉不到行情（例如币安没有这个交易对）时，脚本照样结案，复盘图改为「仅关键价格示意」的虚线简图。

## 3. 作废

登记错误（例如重复登记）时，**不要删除文件**，编号必须连续。手动编辑该档案：

```yaml
status: void
voidReason: 与 IC-2026-0003 重复登记
changelog:
  - at: '2026-10-14T12:00:00+08:00'
    note: 作废：重复登记
```

作废档案保留编号，不计入任何统计。

## 4. 修改已公开的档案

直接编辑字段，并在 `changelog` 里追加一条说明（时间 + 改了什么、为什么）。修改记录会显示在档案页上。

## 5. 推送前自检

```bash
pnpm content:validate          # 开发模式
CONTENT_STRICT=1 pnpm content:validate   # 按生产标准检查
```

常见错误：

| 报错 | 原因与处理 |
|---|---|
| `Unrecognized key: "asset"` | 进行中的档案里写了成员字段。删掉，等结案时用脚本补 |
| `expected string, received date` | 时间没加引号。改成 `'2026-10-14T10:02:00+08:00'` |
| `gap or duplicate` | 编号不连续。不要删文件，改用作废 |
| `ids must follow registration order` | 编号大的档案登记得更早，检查 `registeredAt` |
| `closedReturnPct … does not match prices` | 手动改过价格或收益，二者对不上。用脚本重算，或者修正数字 |
| `thesis/review still contains 【待填写】` | 依据或复盘还没写 |
