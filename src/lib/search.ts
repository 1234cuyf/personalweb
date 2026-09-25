import { getPosts, getProjects } from '@/lib/content';

export type SearchKind = '页面' | '文章' | '作品';

export type SearchItem = {
  title: string;
  description: string;
  href: string;
  kind: SearchKind;
};

/** 固定页面，永远可搜。 */
const STATIC_PAGES: SearchItem[] = [
  { title: '首页', description: '站点首页', href: '/', kind: '页面' },
  { title: '作品', description: '我做过的项目', href: '/projects', kind: '页面' },
  { title: '博客', description: '全部文章', href: '/blog', kind: '页面' },
  { title: '简历', description: '经历与技能', href: '/resume', kind: '页面' },
  { title: '关于', description: '联系方式', href: '/about', kind: '页面' },
];

/**
 * 构建站内搜索索引。
 *
 * 这是一个静态站，没有搜索后端，所以索引在构建期生成、随页面一起发给客户端，
 * 由 cmdk 在前端做过滤。文章数量到几百篇时这个 JSON 会开始变大，
 * 那时应该改成按需拉取的独立 JSON 端点。
 */
export async function buildSearchIndex(): Promise<SearchItem[]> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  return [
    ...STATIC_PAGES,
    ...posts.map<SearchItem>((post) => ({
      title: post.data.title,
      description: post.data.description,
      href: `/blog/${post.id}/`,
      kind: '文章',
    })),
    ...projects.map<SearchItem>((project) => ({
      title: project.data.title,
      description: project.data.description,
      href: `/projects/${project.id}/`,
      kind: '作品',
    })),
  ];
}
