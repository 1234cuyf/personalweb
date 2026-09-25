---
title: 用 Astro 7 + Tailwind 4 + shadcn/ui 搭一个内容站
description: 记录一次真实的搭建过程：版本坑、为什么展示组件不需要水合、以及怎么让客户端 JS 保持接近零。
pubDate: 2026-07-18
tags: ['Astro', 'Tailwind', 'shadcn']
---

这套组合在 2026 年已经相当成熟，但版本切换期有几个坑值得记下来。

## Astro 7 的变化

最大的变化是编译器重写成了 Rust，Markdown 管线换成了 Sätteri。对使用者来说有两件事要适应。

第一，**编译器现在是 JSX 严格模式**。以前写法不严谨的地方会被静默纠正，现在直接报错：

```astro
<!-- 现在会报错：标签没闭合 -->
<div>Hello

<!-- 这样才对 -->
<div>Hello</div>
```

第二，**空白折叠规则跟 React 一致了**。下面这段以前会渲染出空格，现在不会：

```astro
<span>Hello</span>
<span>World</span>
<!-- 渲染结果是 HelloWorld -->
```

需要空格就显式写 `{' '}`。这个坑在写导航和面包屑时特别容易踩到。

## Tailwind 4 不再需要配置文件

`tailwind.config.js` 没了，改在 CSS 里用 `@theme` 声明：

```css
@import "tailwindcss";

@theme {
  --font-sans: ui-sans-serif, system-ui, "PingFang SC", sans-serif;
}
```

接入方式也从 Astro 集成换成了 Vite 插件（`@tailwindcss/vite`）。老教程里的 `@astrojs/tailwind` 已经废弃了。

## shadcn/ui 在 Astro 里怎么用

这是最值得说的一点。shadcn/ui 现在是 React 组件，装它就必须引入 `@astrojs/react`。很多人以为这意味着整站都要背 React 运行时的开销——**并不是**。

Astro 里用 React 组件，**不加 `client:*` 指令就只在构建期渲染成静态 HTML**，浏览器拿不到任何 JS：

```astro
---
import { Card, CardContent } from '@/components/ui/card';
---

<!-- 纯静态：零 JS 输出 -->
<Card>
  <CardContent>这段内容在构建时就变成了 HTML</CardContent>
</Card>
```

只有真正需要交互的组件才加水合指令：

```astro
<!-- 只有在视口内才加载 React -->
<Sheet client:visible />
```

所以策略很清楚：**能用静态的就静态**。卡片、徽章、分隔线、头像全部静态渲染；只有主题切换菜单和移动端抽屉才水合。结果是整站客户端 JS 只有几十 KB，而不是几百 KB。

## 小结

选型的关键不是"用了哪些库"，而是**想清楚哪些代码必须跑到浏览器里**。剩下的一律在构建期解决掉。
