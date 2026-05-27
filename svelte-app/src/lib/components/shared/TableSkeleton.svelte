<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton/index.svelte';

  interface Props {
    rows?: number;
  }

  let { rows = 5 }: Props = $props();
</script>

<div class="space-y-2">
  <Skeleton class="h-10 w-full" />
  {#each Array.from({ length: rows }, (_, i) => i) as i}
    <Skeleton class="h-12 w-full" />
  {/each}
</div>
