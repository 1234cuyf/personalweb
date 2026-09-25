export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * 全站配置。改这里就能改站点的名字、导航和页脚。
 * 注意：url 必须和 astro.config.mjs 里的 site 保持一致，
 * 否则 sitemap 与 RSS 里的绝对链接会指向错误域名。
 */
export const site = {
  /** 站点标题 / 你的名字 */
  title: '张三',
  /** 一句话简介，用于首页首屏与 SEO description */
  description: '前端工程师，关注 Web 性能、开发者体验与设计系统。',
  /** 作者名，用于 RSS 与页脚版权 */
  author: '张三',
  /** 联系邮箱 */
  email: 'hello@example.com',
  /** 部署域名，需与 astro.config.mjs 的 site 一致 */
  url: 'https://example.com',
  /** 头像，放在 public/ 下，用绝对路径引用 */
  avatar: '/avatar.svg',

  /** 主导航 */
  nav: [
    { label: '首页', href: '/' },
    { label: '作品', href: '/projects' },
    { label: '博客', href: '/blog' },
    { label: '简历', href: '/resume' },
    { label: '关于', href: '/about' },
  ] as NavItem[],

  /** 社交链接，展示在页脚与简历页 */
  social: [
    { label: 'GitHub', href: 'https://github.com/yourname' },
    { label: 'X', href: 'https://x.com/yourname' },
    { label: '邮箱', href: 'mailto:hello@example.com' },
  ] as SocialLink[],
};
