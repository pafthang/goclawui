<script lang="ts">
  import type { TreeNode } from '$lib/types/file-helpers';
  import { FileTreeFileIcon, TreeItem } from '$lib/components/shared';
  import { DndContext } from 'svelte-dnd-action';
  import { Loader2 } from 'lucide-svelte';
  import { t } from '$lib/i18n/translations';

  interface Props {
    tree: TreeNode[];
    filesLoading: boolean;
    activePath: string | null;
    onSelect: (path: string) => void;
    onDelete?: (path: string, isDir: boolean) => void;
    onLoadMore?: (path: string) => void;
    onMove?: (fromPath: string, toFolder: string) => void;
    showSize?: boolean;
  }

  let {
    tree,
    filesLoading,
    activePath,
    onSelect,
    onDelete,
    onLoadMore,
    onMove,
    showSize = false,
  }: Props = $props();

  let autoExpandPath: string | null = $state(null);
  const dndEnabled = !!onMove;

  // Find a node by path in the tree
  function findNode(nodes: TreeNode[], path: string): TreeNode | undefined {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children.length > 0) {
        const found = findNode(node.children, path);
        if (found) return found;
      }
    }
    return undefined;
  }

  let activeNode: TreeNode | undefined = $derived(autoExpandPath ? findNode(tree, autoExpandPath) : undefined);

  function handleDropRoot(e: CustomEvent<{ sourceId: string }>) {
    const fromPath = e.detail.sourceId;
    onMove?.(fromPath, '');
  }
</script>

{#if filesLoading}
  <div class="flex items-center justify-center py-8">
    <Loader2 class="h-5 w-5 animate-spin text-muted-foreground" />
  </div>
{:else if tree.length === 0}
  <p class="px-3 py-4 text-sm text-muted-foreground">{t('noFiles')}</p>
{:else}
  <div class="flex-1 min-h-0">
    {#if dndEnabled}
      <DndContext
        dropTarget={autoExpandPath}
        onDrop={(e) => {
          if (e.detail.targetId === '__root__') {
            handleDropRoot(e as any);
          }
        }}
        onDragOver={(e) => {
          const over = e.detail.over;
          if (over && typeof over.id === 'string' && over.id !== '__root__') {
            autoExpandPath = over.id;
          }
        }}
        onDragEnd={() => {
          autoExpandPath = null;
        }}
      >
        <div use:droppable={{ id: '__root__' }} class="min-h-full">
          {#each tree as node (node.path)}
            <TreeItem
              {node}
              depth={0}
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
        </div>
      </DndContext>
    {:else}
      {#each tree as node (node.path)}
        <TreeItem
          {node}
          depth={0}
          {activePath}
          dndEnabled={false}
          autoExpandPath={null}
          {showSize}
          {onSelect}
          {onDelete}
          {onLoadMore}
        />
      {/each}
    {/if}
  </div>
{/if}

</script>
