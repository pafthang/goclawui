<script lang="ts">
  import { Download } from 'lucide-svelte';

  function toFileUrl(src: string): string {
    if (src.startsWith('/v1/files/')) {
      return src;
    }
    return src;
  }

  function toDownloadUrl(src: string): string {
    return src;
  }

  function fileNameFromHref(href: string): string {
    const path = href.split('?')[0] ?? href;
    const segments = path.split('/');
    return segments[segments.length - 1] ?? 'file';
  }

  interface Props {
    src?: string;
    alt?: string;
    openLightbox: (src: string, alt: string) => void;
    [key: string]: any;
  }

  let { src, alt, openLightbox, ...props }: Props = $props();
  const isFileLink = src ? src.startsWith('/v1/files/') || src.includes('/v1/files/') : false;
  const resolvedSrc = isFileLink ? toFileUrl(src!) : src;
  const displayName = alt || fileNameFromHref(src ?? '');

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    if (resolvedSrc) openLightbox(resolvedSrc, alt ?? 'image');
  }
</script>

<span class="group/img relative inline-block overflow-hidden rounded-lg border shadow-sm">
  <img
    src={resolvedSrc}
    alt={alt ?? 'image'}
    class="block max-w-sm cursor-pointer hover:opacity-90 transition-opacity"
    loading="lazy"
    onclick={handleClick}
    {...props}
  />
  {#if resolvedSrc}
    <a
      href={toDownloadUrl(resolvedSrc)}
      download={displayName}
      onclick={(e: MouseEvent) => e.stopPropagation()}
      class="absolute top-2 right-2 flex items-center justify-center rounded-lg bg-white/90 dark:bg-neutral-800/90 p-1.5 text-neutral-700 dark:text-neutral-200 shadow-md ring-1 ring-black/10 dark:ring-white/10 opacity-0 transition-opacity group-hover/img:opacity-100 hover:bg-white dark:hover:bg-neutral-700 cursor-pointer"
      title="Download"
    >
      <Download class="h-4.5 w-4.5" />
    </a>
  {/if}
</span>
