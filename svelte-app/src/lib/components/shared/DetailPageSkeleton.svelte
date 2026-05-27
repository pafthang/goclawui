<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton/index.svelte';

  interface Props {
    tabs?: number;
  }

  let { tabs = 4 }: Props = $props();
</script>

<div class="p-4 sm:p-6">
  <div class="mb-6 flex items-start gap-4">
    <Skeleton class="h-9 w-9 shrink-0 rounded-md" />
    <Skeleton class="h-12 w-12 shrink-0 rounded-xl" />
    <div class="min-w-0 flex-1 space-y-2">
      <Skeleton class="h-6 w-48" />
      <Skeleton class="h-4 w-32" />
    </div>
  </div>
  <div class="max-w-4xl rounded-xl border bg-card p-3 shadow-sm sm:p-4">
    <div class="flex gap-2 border-b pb-2">
      {#each Array.from({ length: tabs }, (_, i) => i) as i}
        <Skeleton key={i} class="h-8 w-20 rounded-md" />
      {/each}
    </div>
    <div class="mt-4 space-y-3">
      <Skeleton class="h-10 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
      <Skeleton class="h-12 w-full" />
    </div>
  </div>
</div>
