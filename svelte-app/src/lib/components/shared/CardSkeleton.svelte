<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton/index.svelte';
</script>

<div class="rounded-lg border p-4">
  <Skeleton class="mb-2 h-5 w-3/4" />
  <Skeleton class="mb-4 h-4 w-1/2" />
  <div class="flex gap-2">
    <Skeleton class="h-5 w-16" />
    <Skeleton class="h-5 w-16" />
  </div>
</div>
