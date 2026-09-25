import { useEffect, useState } from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Theme = 'light' | 'dark' | 'system';

const THEME_LABELS: Record<Theme, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统',
};

/** localStorage 的键名，必须与 BaseLayout.astro 里的阻塞式主题脚本保持一致 */
const STORAGE_KEY = 'theme';

function prefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  // 首屏的主题已由 BaseLayout 的阻塞式脚本应用，这里只同步 UI 状态
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setTheme(stored);
    }
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const dark = next === 'system' ? prefersDark() : next === 'dark';
    document.documentElement.classList.toggle('dark', dark);

    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`切换主题，当前：${THEME_LABELS[theme]}`}
          />
        }
      >
        <SunIcon className="size-4 dark:hidden" />
        <MoonIcon className="hidden size-4 dark:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-32">
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
