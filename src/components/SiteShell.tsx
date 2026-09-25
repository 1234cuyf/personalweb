import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from 'react';

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
 * 外壳崩溃时的降级视图。
 *
 * 页面内容是作为 children 待在岛内部的，所以外壳里任何未捕获的异常都会把
 * 整页一起干掉（表现就是白屏）。这个降级视图保证即使侧边栏坏了，
 * 内容与导航仍然可用。
 */
function PlainShell({
  nav,
  config,
  children,
}: {
  nav: NavItem[];
  config: SiteConfig;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border px-4 py-3 text-sm">
        <a href="/" className="font-medium">
          {config.author}
        </a>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border px-4 py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {config.author}
      </footer>
    </div>
  );
}

type BoundaryProps = {
  fallback: ReactNode;
  children: ReactNode;
};

type BoundaryState = {
  failed: boolean;
};

/** 捕获外壳渲染期的异常，避免整页白屏。 */
class ShellBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('[SiteShell] 渲染失败，已降级为简易外壳：', error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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
    <ShellBoundary
      fallback={
        <PlainShell nav={nav} config={config}>
          {children}
        </PlainShell>
      }
    >
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
              <p>
                © {new Date().getFullYear()} {config.author}
              </p>
            </footer>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ShellBoundary>
  );
}
