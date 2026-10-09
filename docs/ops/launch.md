# 上线手册（M14）

> 按顺序执行 WEBSITE_PLAN §23。每一步写明**谁做**、**怎么做**、**怎么确认做完了**。
> 代码侧已经就绪；剩下的都是账号、密钥和内容，只能由你来提供或操作。
> 做完一步就在方框里打勾，最后在「上线记录」里填写时间。

## T−7 到 T−1：准备

### 1. 域名与 Vercel 项目（你）
- [ ] 在 Vercel Import `sunatec/hero`，构建命令保持默认（`pnpm build`）
- [ ] 绑定正式域名，确认 HTTPS 生效
- [ ] 把 `site.config.ts` 的 `url` 改成正式域名（目前是占位的 `https://example.invalid`，生产构建会拦截）

**确认**：`https://你的域名` 能打开预览版本。

### 2. 生产环境变量（你，在 Vercel → Settings → Environment Variables → Production）

| 变量 | 来源 | 说明 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 正式域名，如 `https://0xinchain.com` | canonical、OG 图、sitemap 都用它 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile → Add site（填正式域名） | 不配置时 /join 只显示「请私信官方 TG」 |
| `TURNSTILE_SECRET_KEY` | 同上 | 只放服务端 |
| `TG_BOT_TOKEN` | Telegram @BotFather → `/newbot` | 只放服务端 |
| `TG_ADMIN_CHAT_ID` | 见第 3 步 | 以 `-100` 开头的群 ID |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | 正式域名（不带 https） | 不配置时不加载统计脚本 |

不要设置 `APPLY_RATE_LIMIT`（它只给 e2e 关掉限流用）。

### 3. TG 管理员群（你）
- [ ] 新建一个私密群，只拉管理员和第 2 步创建的 Bot
- [ ] 在群里随便发一条消息，然后打开 `https://api.telegram.org/bot<TOKEN>/getUpdates`，找到 `"chat":{"id":-100…}`，这就是 `TG_ADMIN_CHAT_ID`
- [ ] 本机验证送达：

```bash
TG_BOT_TOKEN=填你的 TG_ADMIN_CHAT_ID=填你的 pnpm tg:ping
```

**确认**：群里收到「连通测试」消息。

### 4. Plausible（你）
- [ ] 在 Plausible 添加站点（域名与 `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` 一致）
- [ ] 在 Goals 里添加以下自定义事件（WEBSITE_PLAN §20，代码已经在发送）：
  `cta_apply_click` · `ledger_filter` · `redaction_reveal` · `outbound_x` · `outbound_tg` · `lang_switch` · `apply_form_start` · `apply_form_submit` · `apply_form_success` · `apply_form_error`
- [ ] 页面类指标（台账浏览、档案浏览、方法论、/verify）用 Pageview goal，按路径添加：`/ledger`、`/ledger/*`、`/methodology`、`/verify`、`/join`

### 5. 内容与配置（你提供，我来改；或你按下面直接改）

`site.config.ts` 里还有 7 项 `TBD`，生产构建会拦截：

| 字段 | 对应待确认事项 |
|---|---|
| `ledgerStartDate`（台账起始日，YYYY-MM-DD，= 上线日） | B10 |
| `pricing.plans[].from` × 3（季度 / 半年 / 年付参考价，BNB） | B1 |
| `officialChannels[].numericId` × 2（TG、X 的数字 ID） | B2 |
| `social.telegram`（公开频道链接，没有就告诉我，改成不显示） | B3 |

还需要处理的内容：
- [ ] **删除** `content/ledger/2026/IC-2026-0001～0003.mdx`（示例档案；正式台账从上线日的第一份重新编号）
- [ ] `content/pages/agent.mdx`：填代号、入行年份，确认第一人称正文，去掉 `demo: true`（B4、B5）
- [ ] 4 个规划中模块：确认要展示哪些，去掉对应文件的 `demo: true`，不做的删掉（A5）
- [ ] 大事记、回复时效、续费规则、BNB 以外币种（B6、B7、A3、A4）
- [ ] 法律页律师审阅后把 `reviewed` 改成 `true`（open-items D；不改只是警告，不拦截）

**确认**：

```bash
CONTENT_STRICT=1 pnpm content:validate
```

输出 `0 error(s)`。

### 6. 对外同步（你）
- [ ] `/verify` 页账号与数字 ID 与实际一致（截图核对）
- [ ] Linktree、X bio、Notion 顶部加官网链接，写法统一为「0xInChain 链上情报局」
- [ ] 熟悉回滚：Vercel → Deployments → 上一个生产部署 → **Instant Rollback**

## T0：上线日

1. [ ] 合并到 `main`，等 CI 全绿，Vercel 生产部署完成
2. [ ] 冒烟测试（手机和电脑各一遍）：
   - 首页能打开，Hero 卡片显示最新档案
   - `/ledger` 筛选可用，档案详情能打开
   - `/join` 用真实账号提交一次 → TG 管理员群 60 秒内收到消息
   - `/verify` 账号正确
   - 分享一个档案链接到 TG，预览卡片正常
3. [ ] 登记第一份正式档案（台账从这一刻开始计时）：

```bash
pnpm new:signal --module <模块> --direction <long|short|risk-alert> --chains <链> --opened-at <ISO 时间>
```

   提交并推送，确认 `/ledger/IC-2026-0001` 上线
4. [ ] 发 X 上线推文，链接带 UTM：`https://你的域名/ledger?utm_source=x&utm_medium=social&utm_campaign=launch`
5. [ ] TG 公开频道和成员群发公告
6. [ ] 上线后 1 小时：Rich Results Test（首页 + 一份档案）、X 卡片验证工具各跑一次

## T+1 到 T+14

- 每天：TG 申请是否送达、Vercel 错误日志、档案是否按时立案和结案（`docs/ops/ledger-runbook.md`）
- T+7：在 Plausible 看漏斗（访问 → 台账 → /join → 表单开始 → 提交），调整 CTA 或文案
- T+14：根据大陆访问比例决定是否做 Cloudflare 镜像；用 Vercel Speed Insights 的真实 LCP 决定是否继续优化字体（`docs/perf/m12-report.md`）
- T+30：发布第一份月度台账摘要

## 上线记录

| 项目 | 时间（UTC+8） | 备注 |
|---|---|---|
| 生产部署完成 | | |
| 表单首次真实送达 | | |
| 第一份档案登记（台账起始） | | |
| 上线推文 | | |
| Rich Results / X 卡片验证 | | |
