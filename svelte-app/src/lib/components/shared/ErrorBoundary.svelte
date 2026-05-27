<script lang="ts">
  import { AlertTriangle, RefreshCw } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    children: any;
    fallback?: any;
  }

  let { children, fallback }: Props = $props();
  let hasError = $state(false);
  let retryKey = $state(0);

  function handleError(error: Error) {
    console.error('[ErrorBoundary]', error);
    const msg = (error.message || 'Unknown error').split('\n')[0]?.slice(0, 200);
    // Toast error handling would go here
  }

  function handleRetry() {
    hasError = false;
    retryKey++;
  }

  // Simple error boundary using try-catch in effect
  $effect(() => {
    try {
      // This is a simplified approach - Svelte doesn't have class-based error boundaries like React
      hasError = false;
    } catch (error) {
      handleError(error as Error);
      hasError = true;
    }
  });
</script>

{#if !hasError}
  <svelte:fragment {@render children?.()} key={retryKey} />
{:else}
  {#if fallback}
    <svelte:fragment {@render fallback?.()} />
  {:else}
    <div class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-card p-8 text-center">
      <AlertTriangle class="h-8 w-8 text-muted-foreground" />
      <p class="text-sm text-muted-foreground">Something went wrong</p>
      <Button variant="outline" size="sm" class="gap-1.5" onclick={handleRetry}>
        <RefreshCw class="h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  {/if}
{/if}
