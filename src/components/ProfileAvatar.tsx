import { Avatar } from '@/components/ui/avatar';

/**
 * 静态头像。
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
 * 因此这里用 Avatar 根节点（提供圆角、描边、尺寸）+ 一个原生 <img>。
 * 如果将来想让头像水合以获得 fallback 行为，给它加 client:load 并换回 AvatarImage。
 *
 * 另外注意：Astro 会独立渲染 .astro 文件里的每个框架组件，React context 不跨边界传递，
 * 所以这类组合必须整体封装在 .tsx 内。
 */
export default function ProfileAvatar({
  src,
  name,
  className,
  size = 96,
}: {
  src: string;
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <Avatar className={className}>
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="size-full rounded-full object-cover"
      />
    </Avatar>
  );
}
