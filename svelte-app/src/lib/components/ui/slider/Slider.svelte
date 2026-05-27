<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		value?: number[];
		min?: number;
		max?: number;
		step?: number;
		disabled?: boolean;
		[key: string]: unknown;
	}

	let {
		class: className,
		value = $bindable([0]),
		min = 0,
		max = 100,
		step = 1,
		disabled = false,
		...restProps
	}: Props = $props();

	function handleChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.value && value.length > 0) {
			value[0] = Number(input.value);
		}
	}
</script>

<div
	class={cn(
		'relative flex w-full touch-none select-none items-center',
		'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
		className
	)}
	data-disabled={disabled ? '' : undefined}
	{...restProps}
>
	<div class="bg-input relative h-1.5 w-full grow overflow-hidden rounded-full" role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[0]} tabindex="0" on:input={handleChange}>
		<div
			class="bg-primary absolute h-full"
			style="width: {((value[0] - min) / (max - min)) * 100}%"
		></div>
	</div>
	<div
		class={cn(
			'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow',
			'focus-visible:ring-[3px] focus-visible:outline-none',
			'disabled:pointer-events-none disabled:opacity-50',
			'transition-colors'
		)}
		style="position: absolute; left: {((value[0] - min) / (max - min)) * 100}%; transform: translateX(-50%);"
	></div>
</div>
