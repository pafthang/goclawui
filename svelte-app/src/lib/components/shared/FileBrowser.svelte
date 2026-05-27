<script lang="ts">
  import type { TreeNode } from '$lib/types/file-helpers';
  import { formatSize, sizeBadgeVariant } from '$lib/types/file-helpers';
  import { FileTreePanel } from './FileTreePanel.svelte';
  import { FileContentPanel } from './FileContentPanel.svelte';
  import { Badge, Button } from '$lib/components/ui';
  import { Download } from 'lucide-svelte';
  import { t } from '$lib/i18n/translations';

  interface Props {
    tree: TreeNode[];
    filesLoading: boolean;
    activePath: string | null;
    onSelect: (path: string) => void;
    contentLoading: boolean;
    fileContent: { content: string; path: string; size: number } | null;
    onDelete?: (path: string, isDir: boolean) => void;
    onLoadMore?: (path: string) => void;
    onMove?: (fromPath: string, toFolder: string) => void;
    onDownload?: (path: string) => void;
    fetchBlob?: (path: string) => Promise<Blob>;
    showSize?: boolean;
  }

  let {
    tree,
    filesLoading,
    activePath,
    onSelect,
    contentLoading,
    fileContent,
    onDelete,
    onLoadMore,
    onMove,
    onDownload,
    fetchBlob,
    showSize = false,
  }: Props = $props();

  let isMobile = $state(false);
  let treeWidth = $state(220);
  let mobileShowTree = $state(true);
  let dragging = $state(false);
  let containerRef: HTMLDivElement | null = $state(null);

  // Check if mobile on mount and resize
  $effect(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 640;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  function handleSelect(path: string) {
    onSelect(path);
    if (isMobile) mobileShowTree = false;
  }

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    dragging = true;
    const startX = e.clientX;
    const startW = treeWidth;

    const onMove = (ev: MouseEvent) => {
      if (!dragging || !containerRef) return;
      const maxW = containerRef.offsetWidth * 0.5;
      const newW = Math.max(140, Math.min(maxW, startW + ev.clientX - startX));
      treeWidth = newW;
    };

    const onUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
</script>

{#if isMobile}
  <!-- Mobile: stacked layout -->
  <div class="flex-1 flex flex-col border rounded-md overflow-hidden min-h-0">
    {#if mobileShowTree}
      <div class="flex-1 overflow-y-auto bg-muted/20 py-1">
        <FileTreePanel
          {tree}
          {filesLoading}
          {activePath}
          onSelect={handleSelect}
          {onDelete}
          {onLoadMore}
          {onMove}
          {showSize}
        />
      </div>
    {:else}
      <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div class="flex items-center gap-2 text-xs text-muted-foreground border-b px-3 py-2 shrink-0">
          <button
            type="button"
            onclick={() => mobileShowTree = true}
            class="text-primary hover:underline cursor-pointer shrink-0"
          >
            &larr; {t('filesBack')}
          </button>
          {#if fileContent}
            <span class="font-mono truncate">{fileContent.path}</span>
            <div class="flex items-center gap-1.5 shrink-0 ml-auto">
              <Badge variant={sizeBadgeVariant(fileContent.size)} class="text-2xs px-1.5 py-0">
                {formatSize(fileContent.size)}
              </Badge>
              {#if onDownload}
                <Button variant="ghost" size="icon" class="h-6 w-6" onclick={() => onDownload(fileContent.path)} title={t('download')}>
                  <Download class="h-3.5 w-3.5" />
                </Button>
              {/if}
            </div>
          {/if}
        </div>
        <div class="flex-1 overflow-auto p-3 min-h-0">
          <FileContentPanel {fileContent} {contentLoading} {fetchBlob} {onDownload} />
        </div>
      </div>
    {/if}
  </div>
{:else}
  <!-- Desktop: side-by-side with resizable divider -->
  <div bind:this={containerRef} class="flex-1 flex border rounded-md overflow-hidden min-h-0">
    <div class="overflow-y-auto bg-muted/20 py-1 shrink-0" style={`width: ${treeWidth}px`}>
      <FileTreePanel
        {tree}
        {filesLoading}
        {activePath}
        onSelect={handleSelect}
        {onDelete}
        {onLoadMore}
        {onMove}
        {showSize}
      />
    </div>

    <div
      class="w-1 cursor-col-resize bg-border hover:bg-primary/30 active:bg-primary/50 shrink-0"
      onmousedown={onMouseDown}
    />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      {#if fileContent}
        <div class="flex items-center justify-between text-xs text-muted-foreground border-b px-3 py-2 shrink-0">
          <span class="font-mono truncate">{fileContent.path}</span>
          <div class="flex items-center gap-1.5 shrink-0 ml-auto">
            <Badge variant={sizeBadgeVariant(fileContent.size)} class="text-2xs px-1.5 py-0">
              {formatSize(fileContent.size)}
            </Badge>
            {#if onDownload}
              <Button variant="ghost" size="icon" class="h-6 w-6" onclick={() => onDownload(fileContent.path)} title={t('download')}>
                <Download class="h-3.5 w-3.5" />
              </Button>
            {/if}
          </div>
        </div>
      {/if}
      <div class="flex-1 overflow-auto p-3 min-h-0">
        <FileContentPanel {fileContent} {contentLoading} {fetchBlob} {onDownload} />
      </div>
    </div>
  </div>
{/if}
