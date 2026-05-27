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
		cn(
			'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
			className
		)
	);
</script>

<div class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
