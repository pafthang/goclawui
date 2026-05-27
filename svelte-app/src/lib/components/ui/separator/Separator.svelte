<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		orientation?: 'horizontal' | 'vertical';
		class?: string;
		[key: string]: unknown;
	}

	let {
		orientation = 'horizontal',
		class: className,
		...restProps
	}: Props = $props();

	let classes = $derived(
		cn(
			'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
			className
		)
	);
</script>

<div role="separator" data-orientation={orientation} class={classes} {...restProps}></div>
