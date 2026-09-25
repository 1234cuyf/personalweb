export type ContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  /** 展示用时间区间，例如 "2023.04 – 至今" */
  period: string;
  location?: string;
  highlights: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  highlights?: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

/**
 * 简历数据。
 *
 * 除 name 外所有字段都可以留空 —— 留空的板块会在页面上自动整块隐藏，
 * 不会出现空标题或空列表。想到什么就往对应数组里加一条。
 *
 * 用 TS 而不是 Markdown frontmatter，因为嵌套列表写在 frontmatter 里既难写也容易出错。
 */
export const resume = {
  name: '张豆豆',

  /** 身份标签，例如 '前端工程师'。留空则不显示。 */
  headline: '',

  /** 一段自我介绍。留空则不显示。 */
  summary: '',

  /** 联系方式 */
  contact: [
    {
      label: '邮箱',
      value: '166360735@qq.com',
      href: 'mailto:166360735@qq.com',
    },
  ] as ContactItem[],

  /**
   * 工作经历。加一条的写法：
   * {
   *   company: '公司名',
   *   role: '职位',
   *   period: '2023.04 – 至今',
   *   location: '上海',                       // 可选
   *   highlights: ['做了什么，带来什么结果'],
   * }
   */
  experience: [] as ExperienceItem[],

  /**
   * 教育经历。加一条的写法：
   * { school: '学校', degree: '专业 · 学历', period: '2017.09 – 2021.06', highlights: ['可选'] }
   */
  education: [] as EducationItem[],

  /**
   * 技能，按分组展示。加一组的写法：
   * { group: '语言', items: ['TypeScript', 'JavaScript'] }
   */
  skills: [] as SkillGroup[],
};
