<script lang="ts">
  interface Props {
    delay?: number;
  }

  let { delay = 500 }: Props = $props();
  let show = $state(false);

  $effect(() => {
    const timer = setTimeout(() => {
      show = true;
    }, delay);
    return () => clearTimeout(timer);
  });
</script>

{#if show}
  <div class="flex items-center justify-center py-12">
    <div class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
  </div>
{/if}
