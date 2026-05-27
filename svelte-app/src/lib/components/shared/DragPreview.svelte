<script lang="ts">
  import {
    Folder,
    FileText,
    FileCode2,
    File,
    FileImage,
    FileJson2,
  } from 'lucide-svelte';

  const cls = 'h-4 w-4 shrink-0';

  function getIcon(name: string, isDir: boolean) {
    if (isDir) return { component: Folder, class: `${cls} text-yellow-600` };
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    if (ext === 'md' || ext === 'mdx') return { component: FileText, class: `${cls} text-blue-500` };
    if (ext === 'json' || ext === 'json5') return { component: FileJson2, class: `${cls} text-yellow-600` };
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return { component: FileImage, class: `${cls} text-emerald-500` };
    if (['js', 'ts', 'tsx', 'jsx', 'vue', 'svelte', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)) return { component: FileCode2, class: `${cls} text-orange-500` };
    return { component: File, class: `${cls} text-muted-foreground` };
  }

  interface Props {
    name: string;
    isDir: boolean;
  }

  let { name, isDir }: Props = $props();
  const icon = getIcon(name, isDir);
</script>

<div class="flex items-center gap-1.5 rounded-md border bg-popover px-3 py-1.5 text-sm shadow-lg opacity-90 pointer-events-none max-w-[240px]">
  <svelte:component this={icon.component} class={icon.class} />
  <span class="truncate">{name}</span>
</div>
