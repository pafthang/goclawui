<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    code: string;
  }

  let { code }: Props = $props();
  const uid = Math.random().toString(36).substring(2, 9);
  const diagramId = `mermaid-${uid}`;
  
  let svg = $state<string | null>(null);
  let error = $state<string | null>(null);
  let loading = $state(true);

  async function render() {
    svg = null;
    error = null;
    loading = true;

    try {
      const mermaid = (await import('mermaid')).default;
      const isDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'strict',
      });

      const { svg: renderedSvg } = await mermaid.render(diagramId, code);
      svg = renderedSvg;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    render();
  });
</script>

{#if loading}
  <div class="not-prose my-3 overflow-x-auto rounded-lg border border-border/60">
    <div class="animate-pulse bg-muted/50 h-32 w-full rounded-lg" />
  </div>
{:else if error}
  <div class="not-prose my-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-3">
    <p class="mb-2 text-xs font-semibold text-red-600 dark:text-red-400">
      Mermaid render error
    </p>
    <pre class="overflow-x-auto text-xs text-red-500 dark:text-red-400 whitespace-pre-wrap">
      {error}
    </pre>
    <hr class="my-2 border-red-200 dark:border-red-800" />
    <pre class="overflow-x-auto text-xs text-muted-foreground whitespace-pre">{code}</pre>
  </div>
{:else if svg}
  <div
    class="not-prose my-3 overflow-x-auto rounded-lg border border-border/60 bg-background p-4"
    {@html svg}
  />
{/if}
