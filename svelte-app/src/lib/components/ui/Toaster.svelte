<script lang="ts">
  import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-svelte';
  import { toastStore, type Toast } from '$lib/stores/toast.svelte';
  import { cn } from '$lib/utils';

  type Variant = Toast['variant'];

  const icons: Record<Variant, any> = {
    success: CheckCircle,
    destructive: XCircle,
    warning: AlertTriangle,
    default: Info,
  };

  const styles: Record<Variant, string> = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    destructive: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    default: "border-border bg-card text-foreground",
  };

  let toasts = $state<Toast[]>([]);

  // Subscribe to toast store
  $effect(() => {
    const unsubscribe = toastStore.subscribe(state => {
      toasts = state.toasts;
    });
    return unsubscribe;
  });

  function dismiss(id: string) {
    toastStore.dismiss(id);
  }
</script>

{#if toasts.length > 0}
  <div class="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col-reverse gap-2 pointer-events-none sm:bottom-6 sm:right-6 safe-bottom safe-right">
    {#each toasts.slice(-3) as t (t.id)}
      {@const Icon = icons[t.variant]}
      <div
        class={cn(
          "pointer-events-auto flex w-full items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-2 fade-in duration-200",
          styles[t.variant]
        )}
        role="alert"
      >
        <svelte:component this={Icon} class="mt-0.5 h-4 w-4 shrink-0" />
        <div class="flex-1 min-w-0 space-y-0.5">
          <p class="text-sm font-medium break-words">{t.title}</p>
          {#if t.message}
            <p class="text-xs opacity-80 break-words">{t.message}</p>
          {/if}
        </div>
        <button
          onclick={() => dismiss(t.id)}
          class="shrink-0 rounded-sm opacity-50 hover:opacity-100 transition-opacity"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    {/each}
  </div>
{/if}
