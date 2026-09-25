import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { site } from '@/data/site';
import { getPosts } from '@/lib/content';

export async function GET(context: APIContext) {
  // 走 getPosts()，草稿不会进入订阅源
  const posts = await getPosts();

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>zh-cn</language>',
  });
}
