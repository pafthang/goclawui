<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '$lib/components/ui/select';

  const PAGE_SIZES = [20, 50, 100, 200];

  interface Props {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    pageSizes?: number[];
    class?: string;
  }

  let {
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSizes = PAGE_SIZES,
    class: className
  }: Props = $props();
</script>

{#if total === 0}
  <!-- nothing -->
{:else}
  <div class={`flex flex-col items-center gap-2 border-t px-4 py-3 sm:flex-row sm:justify-between ${className ?? ''}`}>
    <div class="text-sm text-muted-foreground">
      {total} items
    </div>
    <div class="flex items-center gap-2 sm:gap-4">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">Rows</span>
        <Select
          value={String(pageSize)}
          onValueChange={(v: string) => onPageSizeChange(Number(v))}
        >
          <SelectTrigger size="sm" class="w-[84px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {#each pageSizes as s}
              <SelectItem value={String(s)}>
                {s}
              </SelectItem>
            {/each}
          </SelectContent>
        </Select>
      </div>
      <span class="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <div class="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon-sm"
          onclick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          onclick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
{/if}
