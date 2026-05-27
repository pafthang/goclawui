<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    icon?: string;
    title: string;
    description?: string;
    action?: any;
    class?: string;
  }

  let { icon: Icon, title, description, action, class: className }: Props = $props();
</script>

<div class={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
  {#if Icon}
    <div class="mb-4 rounded-full bg-muted p-3">
      {@const IconComponent = Icon}
      <svelte:component this={IconComponent} class="h-6 w-6 text-muted-foreground" />
    </div>
  {/if}
  <h3 class="text-sm font-medium">{title}</h3>
  {#if description}
    <p class="mt-1 text-sm text-muted-foreground">{description}</p>
  {/if}
  {#if action}
    <div class="mt-4">
      <svelte:fragment {@render action?.()} />
    </div>
  {/if}
</div>
