<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let classes = $derived(
		cn('text-2xl font-semibold leading-none tracking-tight', className)
	);
</script>

<h3 class={classes}>
	{#if children}
		{@render children()}
	{/if}
</h3>
