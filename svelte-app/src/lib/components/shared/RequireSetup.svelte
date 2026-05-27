<script lang="ts">
  import { WifiOff, Loader2 } from 'lucide-svelte';

  const CONNECTION_TIMEOUT_MS = 3000;

  interface Props {
    children: any;
  }

  let { children }: Props = $props();
  
  // These would normally come from stores - simplified for migration
  let connected = $state(true);
  let loading = $state(false);
  let needsSetup = $state(false);
  let timedOut = $state(false);

  $effect(() => {
    if (connected) {
      timedOut = false;
      return;
    }
    const timer = setTimeout(() => timedOut = true, CONNECTION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  });
</script>

{#if !connected && timedOut}
  <div class="flex h-dvh items-center justify-center bg-background">
    <div class="flex flex-col items-center gap-4 rounded-xl border bg-card p-8 shadow-lg text-center max-w-sm">
      <WifiOff class="h-10 w-10 text-muted-foreground" />
      <h2 class="text-lg font-semibold">Server unreachable</h2>
      <p class="text-sm text-muted-foreground">
        Cannot connect to the server. Please check your connection.
      </p>
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 class="h-3 w-3 animate-spin" />
        <span>Reconnecting...</span>
      </div>
    </div>
  </div>
{:else if loading}
  <div class="flex h-dvh items-center justify-center">
    <div class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
  </div>
{:else if needsSetup}
  <!-- Redirect to setup would go here -->
  <div>Setup required</div>
{:else}
  <svelte:fragment {@render children?.()} />
{/if}
