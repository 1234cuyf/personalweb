import { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { SearchItem, SearchKind } from '@/lib/search';

const GROUP_ORDER: SearchKind[] = ['页面', '文章', '作品'];

/**
 * 站内搜索（⌘K / Ctrl+K）。
 *
 * 整个 Command 组合必须待在这一个文件里：Command 依赖 cmdk 的 context，
 * 拆到 .astro 里会让 CommandInput/CommandList 拿不到它。
 */
export default function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <SidebarMenuButton onClick={() => setOpen(true)} tooltip="搜索（Ctrl K）">
        <SearchIcon />
        <span>搜索</span>
        <KbdGroup className="ml-auto group-data-[collapsible=icon]:hidden">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </SidebarMenuButton>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="站内搜索"
        description="搜索文章、作品与页面"
      >
        <Command>
          <CommandInput placeholder="搜索文章、作品与页面…" />
          <CommandList>
            <CommandEmpty>没有匹配的内容。</CommandEmpty>
            {GROUP_ORDER.map((kind) => {
              const groupItems = items.filter((item) => item.kind === kind);
              if (groupItems.length === 0) return null;

              return (
                <CommandGroup key={kind} heading={kind}>
                  {groupItems.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={`${item.title} ${item.description} ${item.kind}`}
                      onSelect={() => {
                        setOpen(false);
                        window.location.assign(item.href);
                      }}
                    >
                      <span className="truncate font-medium">{item.title}</span>
                      <span className="ml-auto truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
