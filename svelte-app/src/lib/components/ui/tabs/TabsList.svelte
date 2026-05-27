<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		variant?: 'default' | 'line';
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		class: className,
		variant = 'default',
		children,
		...restProps
	}: Props = $props();

	const variants = {
		default: 'bg-muted',
		line: 'gap-1 bg-transparent'
	};

	let classes = $derived(
		cn(
			'rounded-lg p-[3px] group-data-[orientation=horizontal]/tabs:h-9 data-[variant=line]:rounded-none group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
			variants[variant],
			className
		)
	);
</script>

<div class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
