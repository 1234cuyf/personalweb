// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // 站点真实域名，影响 sitemap / RSS 的绝对链接与 canonical
  site: 'https://10090102.xyz',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
