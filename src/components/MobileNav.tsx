import { useState } from 'react';
import { MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type NavItem = {
  label: string;
  href: string;
};

/**
 * 移动端导航抽屉。只在 < sm 的断点下渲染，
 * 桌面端走 Header.astro 里的静态链接，不加载这个岛。
 */
export default function MobileNav({
  items,
  currentPath,
}: {
  items: NavItem[];
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label="打开菜单" />}
      >
        <MenuIcon />
      </SheetTrigger>

      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle>导航</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-1 px-4">
          {items.map((item) => {
            const active =
              item.href === '/'
                ? currentPath === '/'
                : currentPath === item.href ||
                  currentPath.startsWith(`${item.href}/`);

            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={
                  active
                    ? 'rounded-md bg-muted px-3 py-2 text-sm font-medium'
                    : 'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground'
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
