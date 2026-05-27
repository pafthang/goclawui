<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		class: className,
		children,
		...restProps
	}: Props = $props();

	let classes = $derived(
		cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)
	);
</script>

<div class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
