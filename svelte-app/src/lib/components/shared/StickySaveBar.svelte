<script lang="ts">
  import { Save, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    onSave: () => void;
    saving: boolean;
    disabled?: boolean;
    label?: string;
    savingLabel?: string;
    variant?: 'footer' | 'floating';
  }

  let {
    onSave,
    saving,
    disabled,
    label = 'Save',
    savingLabel = 'Saving...',
    variant = 'footer'
  }: Props = $props();

  let showSpin = $state(false);

  $effect(() => {
    if (saving) {
      const timer = setTimeout(() => {
        if (saving) showSpin = true;
      }, 600);
      return () => clearTimeout(timer);
    } else {
      showSpin = false;
    }
  });

  const displayLabel = showSpin ? savingLabel : label;
</script>

{#if variant === 'floating'}
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-end px-4 sm:px-6 lg:px-8 safe-bottom">
    <div class="pointer-events-auto flex items-center justify-end gap-2 rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur-sm">
      <Button onclick={onSave} disabled={saving || showSpin || disabled}>
        {#if showSpin}
          <Loader2 class="h-4 w-4 animate-spin" />
        {:else}
          <Save class="h-4 w-4" />
        {/if}
        {displayLabel}
      </Button>
    </div>
  </div>
{:else}
  <div class="sticky bottom-0 z-20 -mx-3 mt-6 bg-gradient-to-t from-background via-background/95 to-background/0 px-3 pb-1 pt-6 sm:-mx-4 sm:px-4">
    <div class="flex items-center justify-end border-t border-border/70 pt-3">
      <Button onclick={onSave} disabled={saving || showSpin || disabled}>
        {#if showSpin}
          <Loader2 class="h-4 w-4 animate-spin" />
        {:else}
          <Save class="h-4 w-4" />
        {/if}
        {displayLabel}
      </Button>
    </div>
  </div>
{/if}
