<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let classes = $derived(
		cn('text-sm text-muted-foreground', className)
	);
</script>

<p class={classes}>
	{#if children}
		{@render children()}
	{/if}
</p>
