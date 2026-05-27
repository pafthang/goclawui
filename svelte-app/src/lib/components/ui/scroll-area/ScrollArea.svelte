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

let classes = $derived(cn('relative', className));
</script>

<div class={classes} {...restProps}>
<div class="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 overflow-y-auto overflow-x-hidden">
{#if children}
{@render children()}
{/if}
</div>
<div class="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent">
<div class="bg-border relative flex-1 rounded-full w-2"></div>
</div>
</div>
