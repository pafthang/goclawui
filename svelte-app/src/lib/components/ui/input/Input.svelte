<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
		placeholder?: string;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
		children?: Snippet;
		[key: string]: unknown;
	}

	let {
		class: className,
		type = 'text',
		placeholder,
		value = $bindable(''),
		disabled = false,
		required = false,
		name,
		id,
		children,
		...restProps
	}: Props = $props();

	let classes = $derived(
		cn(
			'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)
	);
</script>

<input
	{type}
	{placeholder}
	bind:value
	{disabled}
	{required}
	{name}
	{id}
	class={classes}
	{...restProps}
/>

{#if children}
	{@render children()}
{/if}
