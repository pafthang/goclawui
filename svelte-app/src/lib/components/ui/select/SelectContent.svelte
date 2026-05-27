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
cn(
'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-1',
className
)
);
</script>

<div class={classes} {...restProps} role="listbox">
{#if children}
{@render children()}
{/if}
</div>
