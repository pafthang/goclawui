<script lang="ts">
	import { Brain, ChevronRight } from 'lucide-svelte';
	import { useTranslation } from '$lib/i18n/useTranslation.svelte';

	interface Props {
		text: string;
		isStreaming?: boolean;
	}

	let { text, isStreaming = false }: Props = $props();
	let { t } = useTranslation('common');

	let expanded = $state(false);

	// Auto-expand when streaming starts, keep user's choice when done
	$effect(() => {
		if (isStreaming) {
			expanded = true;
		}
	});
</script>

<div class="rounded-lg border border-muted bg-muted/50 text-sm overflow-hidden">
	<button
		type="button"
		class="flex w-full items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
		onclick={() => (expanded = !expanded)}
	>
		<Brain class="h-3.5 w-3.5 shrink-0 {isStreaming ? 'text-amber-500' : ''}" />
		<span class="text-xs font-medium">
			{isStreaming ? t('thinkingStreaming') : t('thinking')}
		</span>
		{#if isStreaming}
			<span class="inline-block w-1.5 h-3.5 bg-muted-foreground/50 animate-pulse rounded-sm" />
		{/if}
		<ChevronRight
			class="ml-auto h-3 w-3 transition-transform {expanded ? 'rotate-90' : ''}"
		/>
	</button>
	{#if expanded}
		<div class="border-t border-muted px-3 py-2">
			<pre class="whitespace-pre-wrap text-xs text-muted-foreground font-mono leading-relaxed max-h-80 overflow-y-auto break-words">
				{text}
				{#if isStreaming}
					<span class="inline-block w-1.5 h-3.5 bg-muted-foreground/50 animate-pulse ml-0.5 align-text-bottom rounded-sm" />
				{/if}
			</pre>
		</div>
	{/if}
</div>
