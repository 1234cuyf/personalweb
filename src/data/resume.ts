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
 * 简历结构化数据。用 TS 而不是 Markdown frontmatter，
 * 因为嵌套列表写在 frontmatter 里既难写也容易出错。
 */
export const resume = {
  name: '张三',
  headline: '前端工程师',
  summary:
    '五年 Web 前端经验，专注于大型应用的性能优化与组件体系建设。习惯用数据驱动决策，能把模糊需求拆成可交付的方案。',

  /** 联系方式，渲染在简历页顶部 */
  contact: [
    { label: '邮箱', value: 'hello@example.com', href: 'mailto:hello@example.com' },
    { label: 'GitHub', value: 'github.com/yourname', href: 'https://github.com/yourname' },
    { label: '所在地', value: '中国 · 上海' },
  ],

  experience: [
    {
      company: '某某科技有限公司',
      role: '高级前端工程师',
      period: '2023.04 – 至今',
      location: '上海',
      highlights: [
        '主导将核心业务从 Webpack 迁移到 Vite，本地冷启动从 48s 降至 4s。',
        '搭建内部组件库与设计 token 体系，被 6 条业务线复用，UI 回归缺陷下降约 40%。',
        '推动首屏性能专项，LCP 从 3.2s 优化到 1.4s。',
      ],
    },
    {
      company: '某某网络技术有限公司',
      role: '前端工程师',
      period: '2021.07 – 2023.03',
      location: '杭州',
      highlights: [
        '负责数据可视化平台开发，支撑日均 20 万+ 次查询。',
        '设计并落地前端错误监控与埋点方案，线上问题定位时间缩短一半。',
      ],
    },
  ] as ExperienceItem[],

  education: [
    {
      school: '某某大学',
      degree: '计算机科学与技术 · 本科',
      period: '2017.09 – 2021.06',
      highlights: ['校级奖学金两次', 'ACM 校赛二等奖'],
    },
  ] as EducationItem[],

  skills: [
    { group: '语言', items: ['TypeScript', 'JavaScript', 'HTML / CSS', 'Node.js'] },
    { group: '框架与库', items: ['React', 'Vue', 'Astro', 'Tailwind CSS'] },
    { group: '工程化', items: ['Vite', 'Webpack', 'Vitest', 'CI/CD'] },
    { group: '协作', items: ['Figma', 'Git', '技术方案评审', 'Code Review'] },
  ] as SkillGroup[],
};
