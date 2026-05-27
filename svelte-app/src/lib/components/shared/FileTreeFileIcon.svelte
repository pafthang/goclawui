<script lang="ts">
  import {
    FileText,
    FileCode2,
    File,
    FileImage,
    FileJson2,
    FileSpreadsheet,
    FileTerminal,
    FileArchive,
    FileVideo,
    FileAudio,
    FileCog,
    FileType,
    FileLock,
  } from 'lucide-svelte';

  const cls = 'h-4 w-4 shrink-0';

  interface Props {
    name: string;
  }

  let { name }: Props = $props();
  
  function getIcon() {
    const ext = name.split('.').pop()?.toLowerCase() ?? '';
    
    if (ext === 'md' || ext === 'mdx') return { component: FileText, class: `${cls} text-blue-500` };
    if (ext === 'json' || ext === 'json5') return { component: FileJson2, class: `${cls} text-yellow-600` };
    if (ext === 'yaml' || ext === 'yml' || ext === 'toml') return { component: FileCog, class: `${cls} text-orange-500` };
    if (ext === 'csv') return { component: FileSpreadsheet, class: `${cls} text-green-600` };
    if (ext === 'sh' || ext === 'bash' || ext === 'zsh') return { component: FileTerminal, class: `${cls} text-lime-600` };
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) return { component: FileImage, class: `${cls} text-emerald-500` };
    if (ext === 'mp4' || ext === 'webm' || ext === 'mov' || ext === 'avi' || ext === 'mkv') return { component: FileVideo, class: `${cls} text-pink-500` };
    if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'flac' || ext === 'm4a') return { component: FileAudio, class: `${cls} text-orange-500` };
    if (ext === 'zip' || ext === 'tar' || ext === 'gz' || ext === 'rar' || ext === '7z' || ext === 'bz2') return { component: FileArchive, class: `${cls} text-amber-600` };
    if (ext === 'ttf' || ext === 'otf' || ext === 'woff' || ext === 'woff2') return { component: FileType, class: `${cls} text-slate-500` };
    if (ext === 'env' || ext === 'pem' || ext === 'key' || ext === 'crt') return { component: FileLock, class: `${cls} text-red-500` };
    if (['js', 'ts', 'tsx', 'jsx', 'vue', 'svelte', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp'].includes(ext)) return { component: FileCode2, class: `${cls} text-orange-500` };
    return { component: File, class: `${cls} text-muted-foreground` };
  }

  const icon = getIcon();
</script>

<svelte:component this={icon.component} class={icon.class} />
