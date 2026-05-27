<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		size?: 'sm' | 'default';
		checked?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	}

	let {
		class: className,
		size = 'default',
		checked = $bindable(false),
		disabled = false,
		...restProps
	}: Props = $props();

	const sizes = {
		default: 'h-[1.15rem] w-8',
		sm: 'h-3.5 w-6'
	};

	const thumbSizes = {
		default: 'size-4',
		sm: 'size-3'
	};
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	{disabled}
	class={cn(
		'peer cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
		sizes[size],
		className
	)}
	data-state={checked ? 'checked' : 'unchecked'}
	{...restProps}
	on:click={() => (checked = !checked)}
>
	<span
		class={cn(
			'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block rounded-full ring-0 transition-transform',
			thumbSizes[size]
		)}
		data-state={checked ? 'checked' : 'unchecked'}
		style="transform: translateX({checked ? 'calc(100% - 2px)' : '0px'})"
	></span>
</button>
