<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
		[key: string]: unknown;
	}

	let { class: className, ...restProps }: Props = $props();

	let classes = $derived(
		cn('bg-accent animate-pulse rounded-md', className)
	);
</script>

<div class={classes} {...restProps}></div>
