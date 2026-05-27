<script lang="ts">
	import MarkdownRenderer from './markdown-renderer.svelte';

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

{#if !text}
	<div class="flex items-center gap-1 py-1">
		<span class="flex gap-1">
			<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
			<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
			<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
		</span>
	</div>
{:else}
	<div class="relative">
		<MarkdownRenderer content={text} />
		<span class="inline-block h-4 w-0.5 animate-pulse bg-foreground align-text-bottom" />
	</div>
{/if}
