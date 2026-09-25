---
title: 个人站点
description: 你正在看的这个站。Astro 静态生成，客户端 JS 接近零，内容靠 Markdown 管理。
pubDate: 2026-07-01
tech: ['Astro', 'Tailwind CSS', 'shadcn/ui', 'TypeScript']
tags: ['前端', '静态站点']
repo: 'https://github.com/yourname/personalweb'
featured: true
---

## 目标

做一个**不用维护**的个人站点：没有数据库、没有后端、没有需要定期升级的管理面板。写作就是往仓库里丢 Markdown 文件。

## 几个关键取舍

**静态优先。** 全站构建期渲染成 HTML，部署到 CDN。没有服务端运行时，也就没有运行时故障。

**组件库不等于运行时。** 用 shadcn/ui 拿到统一的视觉基础，但展示类组件不加 `client:*` 指令，因此不向浏览器发送 React。只有主题切换和移动端导航是水合的。

**内容与代码分离。** `src/content/` 下是内容，`src/components/` 下是渲染逻辑。加一篇文章不需要碰任何组件。

## 结果

- 文章页首屏几乎是纯 HTML
- 全站无外部字体请求，用系统字体栈
- 新增内容的完整链路：写 `.md` → 提交 → 自动部署

## 还可以改进

- 文章内搜索（目前没有）
- 图片目前没有做响应式处理
