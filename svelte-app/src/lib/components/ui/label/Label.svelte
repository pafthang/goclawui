<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		for?: string;
		children?: Snippet;
	}

	let { class: className, for: htmlFor, children }: Props = $props();

	let classes = $derived(
		cn(
			'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
			className
		)
	);
</script>

<label {htmlFor} class={classes}>
	{#if children}
		{@render children()}
	{/if}
</label>
