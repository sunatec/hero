# 0xInChain / 链上情报局 — 官网

Next.js 16（App Router）· TypeScript 5.9 · Tailwind CSS 4 · Content Collections（MDX + Zod 4）· Biome · Vitest

- 规划：[`WEBSITE_PLAN.md`](WEBSITE_PLAN.md)（里程碑 M0–M14）
- 品牌：[`docs/brand.md`](docs/brand.md) · 设计 tokens / 视觉稿：[`design/`](design/)
- 信息架构与文案：[`docs/ia/`](docs/ia/) · [`docs/copy/`](docs/copy/)
- 内容模型：[`docs/content-model.md`](docs/content-model.md) · 待确认事项：[`docs/open-items.md`](docs/open-items.md)

## 开发

```bash
nvm use            # Node 24（>= 20.9 即可）
pnpm install
pnpm dev           # http://localhost:3000
```

| 命令 | 作用 |
|---|---|
| `pnpm build` | `content:validate` → `next build` |
| `pnpm check` | 提交前全套检查：typecheck · lint · content:validate · copy:lint · test |
| `pnpm typecheck` | 先生成内容类型（`content:build`），再 `tsc --noEmit` |
| `pnpm lint` / `pnpm format` | Biome 检查 / 自动修复 |
| `pnpm content:validate` | 内容门禁：schema + 跨字段规则 + 编号连续性 |
| `pnpm copy:lint` | 违禁词扫描（`docs/brand.md` §3.1） |
| `pnpm test` | Vitest |

pre-commit 钩子（husky）会运行 `content:validate`、`copy:lint`、`lint`。

## 目录

```
app/                 路由（M3 为占位页，各里程碑逐页替换）
components/          组件（M4 起：dossier/ pane/ charts/ site/ ui/）
content/             MDX 内容：ledger/{YYYY}/IC-YYYY-NNNN.mdx · cases/ · modules/ · research/ · pages/
lib/schema/          Zod schema —— 内容格式的唯一真相源
lib/ledger/          收益计算与台账规则（有单元测试）
scripts/             validate-content · lint-copy
site.config.ts       参考价、名额、官方账号 —— 唯一数据源，禁止在别处硬编码
```

## 内容规则（写 MDX 前必读）

1. **时间一律加引号并带时区**：`openedAt: "2026-10-14T10:02:00+08:00"`。不加引号时 YAML 会把它解析成日期对象，校验会失败。
2. **进行中（`status: open`）的档案只允许公开字段**：编号、立案/登记时间、模块、方向、链。`asset`、`entryPrice`、依据正文等成员字段一律不能写进仓库——`content:validate` 和 `next build` 都会拒绝。
3. 结案收益必须和价格算出来的一致，且满足 `最大回撤 ≤ 结案收益 ≤ 最大涨幅`。
4. 编号连续，不能删除；登记错误用 `status: void` 加 `voidReason`。
5. 示例内容带 `demo: true`。**严格模式**（`CONTENT_STRICT=1`，或 Vercel 生产环境 `VERCEL_ENV=production`）下，示例内容或 `site.config.ts` 里剩余的 `TBD` 都会让构建失败——这是有意设计的，防止示例数据被发布上线。

## 部署（Vercel）

仓库还没有远程地址。需要你本人完成：

1. 在 GitHub 新建一个私有仓库，并推送：
   ```bash
   git remote add origin git@github.com:<you>/0xinchain-web.git
   git push -u origin main
   ```
2. 在 Vercel 中 **Import** 这个仓库。框架会被识别为 Next.js；构建命令保持默认（`pnpm build`）即可。
3. 环境变量按 [`.env.example`](.env.example) 填写（M9 之前可以先留空）。
4. **预览部署**（Preview）可以正常通过。**生产部署**（Production）在 M14 之前会被严格模式拦下，因为示例内容和 `TBD` 配置都还在——这是预期行为。

## 技术决定（M3）

| 决定 | 原因 |
|---|---|
| TypeScript 5.9，没有用 7.0 | 7.0 是 Go 重写的版本，Next 构建时依赖的编程接口兼容性没有保证 |
| Biome 默认配置 + 在脚本中指定检查目录 | ecc 插件的 config-protection 钩子禁止新建 `biome.json`；默认规则已经够用。Tailwind 指令通过 `--css-parse-tailwind-directives` 参数开启 |
| 单一根布局，`/en` 用 `<div lang="en">` | 多根布局需要实验性的 `global-not-found`；元素级 `lang` 加 hreflang 已经足够 |
| 中文字体不预加载 | Google Fonts 按 unicode-range 切片按需加载，只预加载 Latin 展示字体 |
| 自写 `content:validate` 作为构建门禁 | Content Collections 本身也会拒绝非法内容（已实测），但它跑不了跨字段规则和编号连续性检查 |
