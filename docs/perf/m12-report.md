# M12 性能与 SEO 报告（2026-09-30）

测量方式：`INDEXABLE=1 NEXT_PUBLIC_SITE_URL=http://localhost:3100 pnpm build` → `next start -p 3100` → Lighthouse 13 默认移动端配置（模拟慢速 4G + 4× CPU 降速），本机 Chrome headless。数值会在几分之间波动：首页三次测得 90、95、89。

## Lighthouse（移动端）

| 页面 | Performance | A11y | Best Practices | SEO | LCP | CLS | TBT | 传输量 |
|---|---|---|---|---|---|---|---|---|
| / | 89 | 100 | 100 | 100 | 3.5 s | 0.003 | 10 ms | 454 KB |
| /ledger | 92 | 100 | 100 | 100 | 3.2 s | 0.001 | 0 ms | 452 KB |
| /ledger/IC-2026-0001 | 92 | 100 | 100 | 100 | 3.2 s | 0.001 | 0 ms | 430 KB |
| /tools | 91 | 100 | 100 | 100 | 3.4 s | 0.003 | 0 ms | 451 KB |
| /join | 92 | 100 | 100 | 100 | 3.3 s | 0 | 10 ms | 404 KB |
| /community | 92 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms | 419 KB |
| /en | 88 | 100 | 100 | 100 | 3.7 s | 0.016 | 0 ms | 452 KB |

对照 §16：A11y ≥ 95 ✓ · Best Practices ≥ 95 ✓ · SEO 100 ✓ · CLS < 0.05 ✓ · Performance ≥ 90：5/7 页达标，首页在 89–95 之间波动，/en 88 · **LCP < 2.0s 未达到**（模拟值 3.2–3.7s）。

## 做了什么

| 改动 | 效果（首页） |
|---|---|
| 正文中文改用系统字体（苹方 / 微软雅黑 / Noto Sans CJK），去掉 Noto Sans SC 网络字体 | 字体 −1.0 MB |
| 标题衬线改为自托管子集：`pnpm fonts:subset` 逐页收集实际以衬线渲染的字，按 700 / 900 字重向 Google Fonts 请求子集，提交到 `app/fonts/` | 字体 1.1 MB → 124 KB，并去掉 68 KB 阻塞渲染的 `@font-face` CSS |
| Newsreader 去掉 opsz 轴、不预加载 | 字体 −150 KB |
| /join 的表单 schema 改用 `zod/mini`，并在首次提交时才动态加载 | /join JS 273 → 185 KB |
| 结果 | 传输量 2.8 MB → 454 KB；FCP 15.2 s → 1.1–2.0 s；Performance 55 → 89–95 |

## JS 预算（§16 已按用户确认改口径）

`pnpm bundle:report`：框架运行时（Next 16 + React 19）固定约 170 KB gzip，不计入预算；**自有代码每页 ≤ 30 KB**。

```
✓ / — own 18.0 KB (budget 30 KB) · runtime 170.0 KB · total 187.9 KB
✓ /ledger — own 14.8 KB (budget 30 KB) · runtime 170.0 KB · total 184.7 KB
✓ /tools — own 13.2 KB (budget 30 KB) · runtime 170.0 KB · total 183.2 KB
✓ /join — own 15.0 KB (budget 30 KB) · runtime 170.0 KB · total 185.0 KB
✓ /cases — own 12.7 KB (budget 30 KB) · runtime 170.0 KB · total 182.7 KB
✓ /en — own 9.5 KB (budget 30 KB) · runtime 170.0 KB · total 179.5 KB
✓ /verify — own 9.5 KB (budget 30 KB) · runtime 170.0 KB · total 179.5 KB
```

## LCP 仍偏高的原因与可选做法

LCP 元素是首页 H1「链上情报局」（衬线 900，38 KB）。`next/font/local` 会把 700（88 KB）和 900 两个子集一起预加载，两者争抢带宽。可选做法：
1. 让衬线 700 只用于少数位置（导航、「我们盯什么」段落改用无衬线），把 700 子集压到 30 KB 以下；
2. 放弃 `next/font/local`，手写 `@font-face` 并只预加载 900（会失去自动生成的备用字体度量，需要自己控制 CLS）；
3. 上线后以 Vercel Speed Insights 的真实用户 LCP 为准再决定。模拟值偏保守，本机实测 FCP 约 1 s。

## 上线后才能做的验证

- Google Rich Results Test（需要公网 URL）；本地已由 `e2e/seo.spec.ts` 校验 JSON-LD 可解析、`@context` 与 `@type` 正确
- X 卡片验证（需要公网 URL）；本地已校验每页都有 `summary_large_image`、`og:image` 可访问且为 PNG
