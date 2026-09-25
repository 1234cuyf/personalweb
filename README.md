# Personalweb

个人网站：作品集 + 博客 + 简历三合一。纯静态输出，内容用 Markdown 管理。

## 技术栈

| 项 | 选择 |
|---|---|
| 框架 | Astro 7（静态输出，无 adapter、无服务端运行时） |
| 样式 | Tailwind CSS 4（通过 `@tailwindcss/vite` 插件接入） |
| UI 组件 | shadcn/ui（React 组件，Base UI 原语，`--base base`） |
| 内容 | Astro Content Collections（`glob()` loader + Zod schema） |

站点没有数据库、没有后端、没有需要定期升级的管理面板。写作就是往仓库里放 Markdown 文件。

## 快速开始

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产出 dist/
npm run preview  # 预览构建产物
npm run check    # TypeScript + Astro 类型检查
```

> **本机环境注意**：如果 `npm install` 报 `EPERM`（npm 默认缓存目录在受限目录下写不进去），
> 把缓存指到项目内即可：
>
> ```powershell
> $env:npm_config_cache = "$PWD\.npm-cache"; npm install
> ```
>
> `.npm-cache/` 已在 `.gitignore` 中。

## 目录结构

```
src/
├─ content.config.ts        # 内容集合的 schema 定义（改字段就来这里）
├─ data/
│  ├─ site.ts               # 站点名、导航、社交链接、头像
│  └─ resume.ts             # 简历结构化数据
├─ lib/
│  ├─ content.ts            # getPosts / getProjects / 标签汇总 / 日期格式化
│  └─ utils.ts              # shadcn 的 cn()
├─ layouts/BaseLayout.astro # HTML 骨架、SEO meta、主题脚本
├─ components/
│  ├─ ui/                   # shadcn CLI 生成，不要手改
│  ├─ Header.astro  Footer.astro
│  ├─ ThemeToggle.tsx       # 主题切换岛（DropdownMenu）
│  ├─ MobileNav.tsx         # 移动端导航岛（Sheet）
│  ├─ ProfileAvatar.tsx     # 头像
│  ├─ ProjectCard.astro  PostCard.astro
├─ content/
│  ├─ blog/                 # 文章，一个 .md 一篇
│  └─ projects/             # 作品，一个 .md 一个
└─ pages/                   # 路由（文件即路由）
```

## 当前状态：最小站点

站点现在是**故意留空**的：没有示例文章、没有示例作品，简历里只有名字和邮箱。

这些字段全部可以留空，留空时页面对应部分会**自动隐藏**，不会出现空标题、空列表或「待补充」这类占位文案：

| 留空的字段 | 效果 |
|---|---|
| `site.description` | 首页不显示副标题；SEO description 回退到站点标题 |
| `site.avatar` | 自动用名字首字生成字母头像 |
| `site.social` | 页脚只显示邮箱与 RSS |
| `site.bio` | 「关于」页只显示名字与联系方式 |
| `resume.headline` / `summary` | 简历页不显示对应行 |
| `resume.experience` / `education` / `skills` | 整个板块隐藏 |

想好了哪块就往哪块填，随时填随时生效。

> `npm run build` 时会出现两条 `[glob-loader] No files found matching ...` 警告 ——
> 那是「内容目录为空」的正常提示，不是错误。

## 日常操作

### 加一篇文章

在 `src/content/blog/` 下新建 `.md`：

```yaml
---
title: 文章标题
description: 一句话摘要，用于列表、SEO 和 RSS
pubDate: 2026-09-01
tags: ['随笔']
draft: false        # true 时只在 dev 可见，生产构建会排除
---

正文用 Markdown 写。
```

**不需要改任何代码**，列表页、标签页、RSS 会自动包含它。

### 加一个作品

在 `src/content/projects/` 下新建 `.md`：

```yaml
---
title: 项目名
description: 一句话说明
pubDate: 2026-09-01
tech: ['Astro', 'TypeScript']   # 渲染成徽章
tags: ['前端']
repo: https://github.com/you/repo   # 可选
demo: https://example.com           # 可选
featured: true                      # 是否进首页精选区
---
```

### 改个人信息

全部集中在 `src/data/site.ts`，每个字段上方都有注释：

| 字段 | 说明 |
|---|---|
| `title` / `author` | 你的名字 |
| `email` | 显示在页脚与「关于」页 |
| `description` | 一句话简介，可留空 |
| `avatar` | 图片放进 `public/` 后填 `'/avatar.jpg'`；留空则用名字首字 |
| `bio` | 「关于」页的段落数组，可留空 |
| `nav` | 导航项，不想要的整行删掉 |
| `social` | 社交链接数组，可留空 |
| `url` | 部署后填真实域名 |

简历内容在 `src/data/resume.ts`，各数组上方注释里写了每一条的字段格式。

其他：

- 站点图标 → 覆盖 `public/favicon.svg`
- 主题色 / 圆角 → `src/styles/global.css` 里的 CSS 变量（`:root` 与 `.dark` 两处都要改）
- 想让「关于」出现在导航里 → 把 `site.ts` 的 `nav` 里那一行加回来（注释里写了）

## 必须知道的约束

这些是实际踩到的坑，改动相关内容前请先读。

### 1. `.astro` 里 `className` 与 `class` 不能混用

- **React 组件**（shadcn）→ 用 `className`
- **原生 HTML 标签** → 用 `class`

```astro
<Card className="h-full">      <!-- 对 -->
<div class="flex gap-3">       <!-- 对 -->
<a href="/x" className="...">  <!-- 错：原生标签要用 class -->
```

写错会被 `npm run check` 抓出来。

### 2. React context 不能跨 `.astro` 的组件边界

Astro 会**独立渲染** `.astro` 文件里的每个框架组件，context 不传递。所以依赖 context 的组件组合必须整体封装在一个 `.tsx` 里：

```astro
<!-- 错：构建期抛 Base UI error #13 -->
<Avatar><AvatarImage /><AvatarFallback /></Avatar>
```

`ThemeToggle.tsx`、`MobileNav.tsx`、`ProfileAvatar.tsx` 都因此把组合收在单个文件内。

### 3. `AvatarImage` 在静态渲染下不显示

Base UI 的 `AvatarImage` 只在图片 `loaded` 后才渲染，而该状态只能由浏览器事件驱动，SSR 时恒为 `idle` → 服务端返回 `null`。静态组件不水合，图片就永远不出现。

也不要用 `keepMounted` 绕过：`Avatar` 根节点是 `relative flex`，Image 与 Fallback 都是 `size-full` 的普通流元素，Base UI 依赖"同一时刻只渲染其中一个"，同时渲染会破坏排版。

`ProfileAvatar.tsx` 的解法是用 `Avatar` 根节点拿样式 + 一个原生 `<img>`。

### 4. Astro 7 的 Markdown 与模板

- 默认处理器是 Rust 写的 **Sätteri**：GFM 表格、任务列表、代码高亮、标题 `id` **开箱即用**，不需要装 remark/rehype 插件
- 模板是 **JSX 严格模式**：未闭合标签会直接报错
- **元素间换行不再产生空格**：`</span><span>` 会渲染成 `HelloWorld`，需要空格就显式写 `{' '}`

### 5. 不要在 `.astro` 表达式里写 JSX

`.astro` 不是 JSX。Base UI 用 `render` 属性做组合（相当于 Radix 的 `asChild`），这种写法只能在 `.tsx` 内部使用：

```tsx
<DropdownMenuTrigger render={<Button variant="ghost" />}>…</DropdownMenuTrigger>
```

需要给链接套按钮样式时，用 `buttonVariants()`：

```astro
<a href="/x" class={buttonVariants({ variant: 'outline' })}>链接</a>
```

## 部署到 Cloudflare

远端仓库：`git@github.com:1234cuyf/personalweb.git`

面板路径：Dashboard → 左侧 **Build → Compute** → **Create application** → **Connect GitHub**。

新面板把原来的 "Workers & Pages" 收进了 **Compute**，顶层已经看不到。快捷入口：
`https://dash.cloudflare.com/?to=/:account/workers-and-pages`

### 走 Workers 静态资源（新面板的默认路径，推荐）

仓库里已经配好 `wrangler.jsonc`，`wrangler` 也已装进 devDependencies，直接填：

| 配置项 | 值 |
|---|---|
| Project name | `personalweb` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Environment variable | **`NODE_VERSION` = `24`** |

本地可以先跑 `npx wrangler deploy --dry-run` 校验配置（只读取文件，不上传）。

### 走 Pages（如果面板里能找到 Pages 入口）

| 配置项 | 值 |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | **`NODE_VERSION` = `24`** |

此时 `wrangler.jsonc` 会被忽略，保留或删掉都可以。

### 两条路都适用的注意事项

**`NODE_VERSION=24` 必须设。** Astro 7 要求 Node `>=22.12.0`，Cloudflare 默认版本偏低，
不设会直接构建失败（仓库里已附 `.nvmrc`，但显式设环境变量更可靠）。

**部署完必须回填域名。** 拿到 `*.workers.dev` 或 `*.pages.dev` 之后，把它填进
`astro.config.mjs` 的 `site` 并再推一次，否则 sitemap 与 RSS 里的绝对链接仍指向占位的
`https://example.com`。

**想用自己域名。** 账号里已有 `cqustart.dpdns.org`，在项目的 Custom domains 里加一个子域
（例如 `me.cqustart.dpdns.org`）即可，然后把这个最终域名填进 `site`。

## 性能实测

以构建产物中的文章页为准（2026-09 实测）：

| 资源 | 原始 | gzip |
|---|---|---|
| JS | 288.4 KB | **93.1 KB** |
| CSS | 64.9 KB | **11.3 KB** |

说明：

- HTML 本身完全静态，首屏内容不依赖 JS
- 展示类组件（Card / Badge / Item / Empty / Button 样式 / Separator / Avatar）**不加 `client:*` 指令**，
  在构建期渲染成纯 HTML，**不产生任何客户端 JS**
- 上面这 93 KB 全部来自两个交互岛：主题切换（`client:idle`）与移动端导航抽屉（`client:visible`），
  它们引入了 React 运行时与 Base UI
- 移动端导航在桌面端是 `display:none`，`client:visible` 不会触发，因此桌面端实际只加载主题岛

如果需要把 JS 进一步压到接近零，可以用原生 `<details>` / 内联脚本替换这两个岛，
shadcn 的展示类组件保持不变。这是一个纯粹的功能取舍，不是缺陷修复。
