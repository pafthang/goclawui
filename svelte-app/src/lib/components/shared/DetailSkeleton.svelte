<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton/index.svelte';
</script>

<div class="space-y-4">
  <Skeleton class="h-8 w-1/3" />
  <Skeleton class="h-4 w-2/3" />
  <div class="space-y-2 pt-4">
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
  </div>
</div>
