<script lang="ts">
  import { Link2 } from 'lucide-svelte';

  interface Props {
    target: string;
    onClick?: (target: string) => void;
  }

  let { target, onClick }: Props = $props();
</script>

{#if onClick}
  <button
    type="button"
    onclick={() => onClick(target)}
    class="inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.85em] font-medium text-primary hover:bg-primary/20 transition-colors"
  >
    <Link2 class="h-3 w-3 shrink-0" />
    {target}
  </button>
{:else}
  <span class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.85em] font-medium text-primary">
    <Link2 class="h-3 w-3 shrink-0" />
    {target}
  </span>
{/if}
