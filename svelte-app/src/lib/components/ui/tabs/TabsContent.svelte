<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		value?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		class: className,
		value,
		children,
		...restProps
	}: Props = $props();

	let classes = $derived(
		cn('flex-1 outline-none', className)
	);
</script>

<div role="tabpanel" class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
