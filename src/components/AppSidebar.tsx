import { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronsUpDownIcon,
  FileText,
  FolderIcon,
  HomeIcon,
  LinkIcon,
  MailIcon,
  MonitorIcon,
  MoonIcon,
  RssIcon,
  SunIcon,
} from 'lucide-react';

import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
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

/** 必须与 BaseLayout.astro 里那段阻塞式主题脚本用的键名一致 */
const THEME_STORAGE_KEY = 'theme';

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isActiveHref(href: string, currentPath: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

/** 字母头像。配了图片就用图片，否则用名字首字。 */
function BrandAvatar({ src, name, className }: { src: string; name: string; className?: string }) {
  return (
    <Avatar className={className}>
      {src ? (
        <img src={src} alt={name} className="size-full rounded-lg object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center rounded-lg bg-sidebar-primary text-sm font-medium text-sidebar-primary-foreground">
          {name.trim().slice(0, 1) || '·'}
        </span>
      )}
    </Avatar>
  );
}

/**
 * 侧边栏底部的用户菜单。
 * 结构参考 shadcn 的 NavUser：触发器显示头像 + 名字 + 邮箱，
 * 菜单里放联系方式与主题切换。
 */
function UserMenu({ config }: { config: SiteConfig }) {
  const [theme, setTheme] = useState<Theme>('system');

  // 首屏主题已由 BaseLayout 的阻塞式脚本应用，这里只同步菜单里的选中态
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
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          />
        }
      >
        <BrandAvatar src={config.avatar} name={config.author} className="size-8 rounded-lg" />
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate font-medium">{config.author}</span>
          <span className="truncate text-xs text-muted-foreground">{config.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="end" sideOffset={4} className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <BrandAvatar src={config.avatar} name={config.author} className="size-8 rounded-lg" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{config.author}</span>
                <span className="truncate text-xs text-muted-foreground">{config.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          {config.email && (
            <DropdownMenuItem render={<a href={`mailto:${config.email}`} />}>
              <MailIcon />
              邮箱
            </DropdownMenuItem>
          )}
          {config.social.map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={<a href={link.href} target="_blank" rel="noopener noreferrer" />}
            >
              <LinkIcon />
              {link.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem render={<a href="/rss.xml" />}>
            <RssIcon />
            RSS 订阅
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => apply(value as Theme)}
        >
          <DropdownMenuRadioItem value="light">
            <SunIcon />
            浅色
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <MoonIcon />
            深色
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <MonitorIcon />
            跟随系统
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
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
              <BrandAvatar src={config.avatar} name={config.author} className="size-8 rounded-lg" />
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
            <UserMenu config={config} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
