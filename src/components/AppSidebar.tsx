import { useEffect, useState } from 'react';
import {
  BookOpen,
  FileText,
  FolderIcon,
  HomeIcon,
  MonitorIcon,
  MoonIcon,
  RssIcon,
  SunIcon,
} from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export type NavItem = {
  label: string;
  href: string;
  icon?: string;
};

export type SiteConfig = {
  title: string;
  author: string;
  description: string;
  email: string;
  avatar: string;
  social: { label: string; href: string }[];
};

/** 图标名 → 组件。站点配置里 nav[].icon 写这里的键名即可。 */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  home: HomeIcon,
  folder: FolderIcon,
  book: BookOpen,
  'file-text': FileText,
};

type Theme = 'light' | 'dark' | 'system';

const THEME_LABELS: Record<Theme, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
};

/** 必须与 BaseLayout.astro 里那段阻塞式主题脚本用的键名一致 */
const THEME_STORAGE_KEY = 'theme';

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isActiveHref(href: string, currentPath: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function ThemeMenu() {
  const [theme, setTheme] = useState<Theme>('system');

  // 首屏主题已由 BaseLayout 的阻塞式脚本应用，这里只同步菜单里的状态文案
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setTheme(stored);
    }
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const dark = next === 'system' ? prefersDark() : next === 'dark';
    document.documentElement.classList.toggle('dark', dark);

    if (next === 'system') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuButton />}>
        <SunIcon className="dark:hidden" />
        <MoonIcon className="hidden dark:block" />
        <span>主题</span>
        <span className="ml-auto text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          {THEME_LABELS[theme]}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" className="min-w-32">
        <DropdownMenuItem onClick={() => apply('light')}>
          <SunIcon />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply('dark')}>
          <MoonIcon />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply('system')}>
          <MonitorIcon />
          跟随系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AppSidebar({
  nav,
  currentPath,
  config,
}: {
  nav: NavItem[];
  currentPath: string;
  config: SiteConfig;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/" />} tooltip={config.author}>
              <Avatar className="size-8 rounded-lg">
                {config.avatar ? (
                  <img
                    src={config.avatar}
                    alt={config.author}
                    className="size-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center rounded-lg bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
                    {config.author.trim().slice(0, 1) || '·'}
                  </span>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{config.author}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {config.description || config.title}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const Icon = item.icon ? ICONS[item.icon] : undefined;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<a href={item.href} />}
                      isActive={isActiveHref(item.href, currentPath)}
                      tooltip={item.label}
                    >
                      {Icon ? <Icon /> : null}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeMenu />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="/rss.xml" />} tooltip="RSS 订阅">
              <RssIcon />
              <span>RSS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
