<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Variant = 'default' | 'destructive';

	interface Props {
		variant?: Variant;
		class?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		variant = 'default',
		class: className,
		children,
		...restProps
	}: Props = $props();

	const baseStyles = 'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current';

	const variants = {
		default: 'bg-card text-card-foreground',
		destructive: 'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90'
	};

	let classes = $derived(cn(baseStyles, variants[variant], className));
</script>

<div role="alert" class={classes} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</div>
