<script lang="ts">
import { cn } from '$lib/utils';
import type { Snippet } from 'svelte';

interface Props {
class?: string;
sideOffset?: number;
children?: Snippet;
[key: string]: unknown;
}

let {
class: className,
sideOffset = 0,
children,
...restProps
}: Props = $props();

let classes = $derived(
cn(
'bg-foreground text-background z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
className
)
);
</script>

<div class={classes} {...restProps} role="tooltip">
{#if children}
{@render children()}
{/if}
</div>
