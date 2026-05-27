<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface TabsProps {
		class?: string;
		value?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let { class: className, value = $bindable(''), children, ...restProps }: TabsProps = $props();

	let classes = $derived(
		cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', className)
	);
</script>

<div class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
