import { Avatar } from '@/components/ui/avatar';

/**
 * 头像。没配图片时自动用名字首字生成字母头像，不需要任何图片资源。
 *
 * 为什么不用 AvatarImage / AvatarFallback：
 * Base UI 的 AvatarImage 只在图片进入 'loaded' 状态后才渲染（见
 * @base-ui/react/avatar/image/AvatarImage.mjs 的 `shouldRender = keepMounted || mounted`）。
 * 而 'loaded' 只能由浏览器事件驱动，服务端渲染时恒为 'idle' —— 所以它 SSR 时返回 null。
 * 本组件是静态组件（不带 client:* 指令），永不水合，用 AvatarImage 会导致头像永远不显示。
 *
 * 也不要用 keepMounted 绕过：Avatar 根节点是 `relative flex`，而 Image 与 Fallback
 * 都是 `size-full` 的普通流元素，Base UI 依赖"同一时刻只渲染其中一个"来保证布局，
 * 两者同时渲染会破坏排版。
 *
 * 如果将来想让头像水合以获得加载失败回退行为，给它加 client:load 并换回 AvatarImage。
 *
 * 另外注意：Astro 会独立渲染 .astro 文件里的每个框架组件，React context 不跨边界传递，
 * 所以这类组合必须整体封装在 .tsx 内。
 */
export default function ProfileAvatar({
  src,
  name,
  className,
}: {
  /** 图片路径，例如 '/avatar.jpg'。留空则显示字母头像。 */
  src?: string;
  name: string;
  className?: string;
}) {
  const initial = name.trim().slice(0, 1) || '?';

  return (
    <Avatar className={className}>
      {src ? (
        <img
          src={src}
          alt={name}
          width={96}
          height={96}
          loading="lazy"
          decoding="async"
          className="size-full rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-full items-center justify-center rounded-full bg-muted text-2xl font-medium text-muted-foreground"
        >
          {initial}
        </span>
      )}
    </Avatar>
  );
}
