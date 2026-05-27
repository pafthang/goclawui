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
cn('text-muted-foreground text-sm', className)
);
</script>

<p class={classes} {...restProps}>
{#if children}
{@render children()}
{/if}
</p>
