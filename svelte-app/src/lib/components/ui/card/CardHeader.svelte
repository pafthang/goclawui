<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children }: Props = $props();

	let classes = $derived(
		cn('flex flex-col space-y-1.5 p-6', className)
	);
</script>

<div class={classes}>
	{#if children}
		{@render children()}
	{/if}
</div>
