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
cn('flex flex-col gap-2 text-center sm:text-left', className)
);
</script>

<div class={classes} {...restProps}>
{#if children}
{@render children()}
{/if}
</div>
