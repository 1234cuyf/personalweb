import { useEffect, useState, type ReactNode } from 'react';

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppSidebar, {
  type NavItem,
  type SiteConfig,
} from '@/components/AppSidebar';

/**
 * 整站外壳。
 *
 * 为什么把整页包进一个 React 岛：shadcn 的 Sidebar 依赖 SidebarProvider 的
 * React context，而 Astro 会独立渲染 .astro 里的每个框架组件、context 不跨边界传递。
 * 同时桌面端布局靠 Sidebar 内部的 gap 元素与 SidebarInset 作为 flex 兄弟节点撑开，
 * 所以内容必须待在 provider 里面。
 *
 * 页面内容通过 children 传入，仍由 Astro 在构建期渲染成静态 HTML。
 */
export default function SiteShell({
  nav,
  currentPath,
  config,
  children,
}: {
  nav: NavItem[];
  currentPath: string;
  config: SiteConfig;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);

  // 恢复上次的收起状态。放在 effect 里而不是 useState 初始化里，
  // 是为了让首次渲染与 SSR 输出保持一致，避免水合不匹配。
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)sidebar_state=(true|false)/);
    if (match) setOpen(match[1] === 'true');
  }, []);

  return (
    <TooltipProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar nav={nav} currentPath={currentPath} config={config} />

        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/60 px-4">
            <SidebarTrigger className="-ml-1" />
            <span className="truncate text-sm font-medium">{config.title}</span>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="border-t border-border/60 px-6 py-6 text-sm text-muted-foreground">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} {config.author}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {config.email && (
                  <a
                    href={`mailto:${config.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {config.email}
                  </a>
                )}
                {config.social.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    rel="noopener"
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
