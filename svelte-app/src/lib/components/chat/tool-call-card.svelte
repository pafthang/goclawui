<script lang="ts">
	import { Wrench, AlertTriangle, ChevronRight, Zap } from 'lucide-svelte';
	import type { ToolStreamEntry } from '$lib/types/chat';

	const isSkillTool = (name: string) => name === 'use_skill';

	/** Build a short summary string from tool arguments for inline display. */
	function buildToolSummary(entry: ToolStreamEntry): string | null {
		if (!entry.arguments) return null;
		const args = entry.arguments;
		const key = args.path ?? args.command ?? args.query ?? args.url ?? args.name;
		if (typeof key === 'string') return key.length > 80 ? key.slice(0, 77) + '...' : key;
		return null;
	}

	interface Props {
		entry: ToolStreamEntry;
		/** Compact mode — less padding, used inside merged groups */
		compact?: boolean;
	}

	let { entry, compact = false }: Props = $props();

	let hasDetails = $derived($state.snapshot(entry.arguments || entry.result));
	let hasError = $derived(entry.phase === 'error' && !!entry.errorContent);
	let canExpand = $derived(hasDetails || hasError);
	let expanded = $state(false);
	let summary = $derived(buildToolSummary(entry));
	let skill = $derived(isSkillTool(entry.name));
	let displayName = $derived(skill ? `skill: ${(entry.arguments?.name as string) || 'unknown'}` : entry.name);

	function toggleExpanded() {
		if (canExpand) {
			expanded = !expanded;
		}
	}
</script>

<div class={compact ? '' : 'rounded-md border bg-muted'}>
	<button
		type="button"
		class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs"
		onclick={toggleExpanded}
		disabled={!canExpand}
	>
		<svelte:component this={Wrench} class="h-3.5 w-3.5" />
		<span class="font-medium shrink-0">{displayName}</span>
		{#if summary}
			<span class="truncate text-muted-foreground ml-1">{summary}</span>
		{/if}
		<span class="ml-auto flex items-center gap-1 shrink-0">
			<span class="text-xs-plus text-muted-foreground">
				{entry.phase}
			</span>
			{#if canExpand}
				<svelte:component this={ChevronRight} class={`h-3 w-3 text-muted-foreground transition-transform ${expanded ? 'rotate-90' : ''}`} />
			{/if}
		</span>
	</button>
	{#if expanded && canExpand}
		<div class="border-t border-muted px-2 py-1.5 space-y-1.5">
			{#if hasError}
				<pre class="text-red-500 whitespace-pre-wrap text-xs">{entry.errorContent}</pre>
			{/if}
			{#if entry.arguments && Object.keys(entry.arguments).length > 0}
				<div>
					<div class="text-2xs font-semibold uppercase text-muted-foreground mb-0.5">Arguments</div>
					<pre class="whitespace-pre-wrap text-xs-plus font-mono bg-background rounded p-1.5 max-h-40 overflow-y-auto">
						{JSON.stringify(entry.arguments, null, 2)}
					</pre>
				</div>
			{/if}
			{#if entry.result}
				<div>
					<div class="text-2xs font-semibold uppercase text-muted-foreground mb-0.5">Result</div>
					<pre class="whitespace-pre-wrap text-xs-plus font-mono bg-background rounded p-1.5 max-h-40 overflow-y-auto">
						{entry.result}
					</pre>
				</div>
			{/if}
		</div>
	{/if}
</div>
