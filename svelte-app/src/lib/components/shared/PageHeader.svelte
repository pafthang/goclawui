<script lang="ts">
  interface Props {
    title: string;
    description?: any;
    actions?: any;
  }

  let { title, description, actions }: Props = $props();
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <h1 class="text-2xl font-semibold tracking-tight">{title}</h1>
    {#if description}
      <p class="mt-1 text-sm text-muted-foreground">
        <svelte:fragment {@render description?.()} />
      </p>
    {/if}
  </div>
  {#if actions}
    <div class="flex items-center gap-2">
      <svelte:fragment {@render actions?.()} />
    </div>
  {/if}
</div>
