<script lang="ts">
  import { Check, Copy } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  interface Props {
    class?: string;
    children?: any;
  }

  let { class: className, children }: Props = $props();
  let copied = $state(false);
  let text = $derived(String(children ?? '').replace(/\n$/, ''));
  let lang = $derived(className?.replace('language-', '') ?? '');

  function copy() {
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="not-prose group relative my-3 overflow-hidden rounded-lg border border-border/60">
  <div class="flex items-center justify-between border-b border-border/40 bg-muted/70 px-3 py-1.5 text-xs-plus font-medium tracking-wide text-muted-foreground uppercase">
    <span>{lang || 'code'}</span>
    <button
      type="button"
      onclick={copy}
      class="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
      title="Copy code"
    >
      {#if copied}
        <Check class="h-3.5 w-3.5" />
      {:else}
        <Copy class="h-3.5 w-3.5" />
      {/if}
    </button>
  </div>
  <pre class="overflow-x-auto bg-muted/30 p-3 text-[13px] leading-normal text-foreground whitespace-pre">
    <code
      class={cn(className, 'font-mono-code')}
      style="word-wrap: normal; overflow-wrap: normal;"
    >
      <svelte:fragment {@render children?.()} />
    </code>
  </pre>
</div>
