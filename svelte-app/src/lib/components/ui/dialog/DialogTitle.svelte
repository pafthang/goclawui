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
cn('text-lg leading-none font-semibold', className)
);
</script>

<h2 class={classes} {...restProps}>
{#if children}
{@render children()}
{/if}
</h2>
