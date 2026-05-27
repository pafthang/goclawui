<script lang="ts">
  import type { TreeNode } from '$lib/types/file-helpers';
  import { formatSize } from '$lib/types/file-helpers';
  import { FileTreeFileIcon } from '$lib/components/shared';
  import { createDraggable, createDroppable } from 'svelte-dnd-action';
  import { Loader2, Trash2, Folder, FolderOpen, ChevronRight } from 'lucide-svelte';
  import { t } from '$lib/i18n/translations';

  interface Props {
    node: TreeNode;
    depth: number;
    activePath: string | null;
    dndEnabled: boolean;
    autoExpandPath: string | null;
    showSize?: boolean;
    onSelect?: (path: string) => void;
    onDelete?: (path: string, isDir: boolean) => void;
    onLoadMore?: (path: string) => void;
    onMove?: (fromPath: string, toFolder: string) => void;
  }

  let {
    node,
    depth,
    activePath,
    dndEnabled,
    autoExpandPath,
    showSize = false,
    onSelect,
    onDelete,
    onLoadMore,
    onMove,
  }: Props = $props();

  let expanded = $state(depth === 0);
  const isActive = activePath === node.path;

  // Auto-expand folder when hovered during drag for 800ms
  $effect(() => {
    if (autoExpandPath === node.path && node.isDir && !expanded) {
      expanded = true;
      if (node.hasChildren && node.children.length === 0 && !node.loading) {
        onLoadMore?.(node.path);
      }
    }
  });

  function handleToggle() {
    const willExpand = !expanded;
    expanded = willExpand;
    if (willExpand && node.isDir && node.hasChildren && node.children.length === 0 && !node.loading) {
      onLoadMore?.(node.path);
    }
  }

  const deleteBtn = onDelete && !node.protected && (
    <button
      type="button"
      class="ml-auto shrink-0 opacity-0 group-hover/tree-item:opacity-100 text-destructive hover:text-destructive/80 transition-opacity cursor-pointer p-0.5"
      title={node.isDir ? t('deleteFolder') : t('deleteFile')}
      onclick={(e) => { e.stopPropagation(); onDelete(node.path, node.isDir); }}
    >
      <Trash2 class="h-3.5 w-3.5" />
    </button>
  );

  const sizeLabel = showSize && (node.isDir ? 0 : node.size) > 0 && (
    <span class="ml-auto shrink-0 text-2xs text-muted-foreground tabular-nums">
      {formatSize(node.size)}
    </span>
  );

  // Folder content renderer
  function renderFolderContent(isDropTargetActive: boolean = false) {
    return (
      <>
        <div
          class={`group/tree-item flex w-full items-center gap-1 rounded px-2 py-1 text-left text-sm cursor-pointer ${
            isDropTargetActive ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-accent'
          }`}
          style={`padding-left: ${depth * 16 + 8}px`}
          onclick={handleToggle}
        >
          <ChevronRight
            class={`h-3 w-3 shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
          {expanded ? (
            <Folder class="h-4 w-4 shrink-0 text-yellow-600" />
          ) : (
            <Folder class="h-4 w-4 shrink-0 text-yellow-600" />
          )}
          <span class="truncate">{node.name}</span>
          {node.loading && <Loader2 class="h-3 w-3 shrink-0 animate-spin text-muted-foreground ml-1" />}
          {sizeLabel}
          {deleteBtn}
        </div>
        {#if expanded}
          {#each node.children as child (child.path)}
            <TreeItem
              {child}
              depth={depth + 1}
              {activePath}
              {dndEnabled}
              {autoExpandPath}
              {showSize}
              {onSelect}
              {onDelete}
              {onLoadMore}
              {onMove}
            />
          {/each}
          {#if expanded && node.hasChildren && node.children.length === 0 && !node.loading}
            <div
              class="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-foreground"
              style={`padding-left: ${(depth + 1) * 16 + 20}px`}
              onclick={() => onLoadMore?.(node.path)}
            >
              <Loader2 class="h-3 w-3" />
              <span>{t('loadMore')}</span>
            </div>
          {/if}
        {/if}
      </>
    );
  }

  // File content renderer
  function renderFileContent() {
    return (
      <div
        class={`group/tree-item flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm cursor-pointer ${
          isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
        }`}
        style={`padding-left: ${depth * 16 + 20}px`}
        onclick={() => onSelect?.(node.path)}
      >
        <FileTreeFileIcon {name}={node.name} />
        <span class="truncate">{node.name}</span>
        {sizeLabel}
        {deleteBtn}
      </div>
    );
  }

  // DnD wrappers
  if (node.isDir) {
    if (dndEnabled && onMove) {
      const { draggable } = createDraggable({ id: node.path });
      const { droppable, isOver } = createDroppable({
        id: node.path,
        onDrop: (e) => {
          const fromPath = e.detail.info.sourceId;
          if (fromPath !== node.path && !node.path.startsWith(fromPath + '/')) {
            onMove(fromPath, node.path);
          }
        }
      });
      
      return (
        <div use:draggable class={isOver ? 'bg-primary/5' : ''}>
          <div use:droppable>
            {renderFolderContent(isOver)}
          </div>
        </div>
      );
    }
    return <div>{renderFolderContent(false)}</div>;
  }

  // File node
  if (dndEnabled && onMove) {
    const { draggable } = createDraggable({ id: node.path });
    return (
      <div use:draggable>
        {renderFileContent()}
      </div>
    );
  }

  return renderFileContent();
</script>

<!-- TreeItem component -->
