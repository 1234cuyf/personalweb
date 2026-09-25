export type NavItem = {
  label: string;
  href: string;
  /** 侧边栏图标名，可选值见 AppSidebar.tsx 的 ICONS 映射；留空则不显示图标 */
  icon?: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

/**
 * 全站配置。
 *
 * 除 title / author 外，所有字段都可以留空 —— 留空时页面对应部分会自动隐藏，
 * 不会留下空标签或占位符。想好了再往里面填，随时改随时生效。
 */
export const site = {
  /** 站点标题 / 你的名字，显示在页头与浏览器标签页 */
  title: '张豆豆',

  /** 作者名，用于页脚版权与 RSS */
  author: '张豆豆',

  /** 联系邮箱，显示在页脚 */
  email: '166360735@qq.com',

  /**
   * 一句话简介。留空时首页只显示名字，SEO description 回退到站点标题。
   * 想好了再填，例：'前端工程师，关注 Web 性能与开发者体验。'
   */
  description: '',

  /**
   * 部署域名。必须和 astro.config.mjs 里的 site 保持一致，
   * 否则 sitemap 与 RSS 中的绝对链接会指向错误域名。
   */
  url: 'https://10090102.xyz',

  /**
   * 头像。把图片放进 public/ 后填绝对路径，例如 '/avatar.jpg'。
   * 留空则自动用名字首字生成字母头像。
   */
  avatar: '',

  /**
   * 「关于」页的正文，每个字符串是一个段落。
   * 留空时该页只显示名字与联系方式。
   */
  bio: [] as string[],

  /**
   * 主导航。不想要的项整行删掉即可。
   *
   * 「关于」默认不在导航里，因为还没写自我介绍时它是个空页面。
   * 等你把上面的 bio 填上，再把这行加回来：{ label: '关于', href: '/about' }
   */
  nav: [
    { label: '首页', href: '/', icon: 'home' },
    { label: '作品', href: '/projects', icon: 'folder' },
    { label: '博客', href: '/blog', icon: 'book' },
    { label: '简历', href: '/resume', icon: 'file-text' },
  ] as NavItem[],

  /**
   * 社交链接，显示在侧边栏底部用户菜单里。留空则该组只剩邮箱与 RSS。
   */
  social: [
    { label: 'GitHub', href: 'https://github.com/1234cuyf' },
  ] as SocialLink[],
};
