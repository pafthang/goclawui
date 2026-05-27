<script lang="ts">
import { cn } from '$lib/utils';
import { ChevronDown } from 'lucide-svelte';
import type { Snippet } from 'svelte';

interface Props {
class?: string;
size?: 'default' | 'sm';
children?: Snippet;
onClick?: () => void;
[key: string]: unknown;
}

let {
class: className,
size = 'default',
children,
onClick,
...restProps
}: Props = $props();

const baseStyles = 'border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-base md:text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4';

const sizes = {
default: 'h-9',
sm: 'h-8'
};

let classes = $derived(cn(baseStyles, sizes[size], className));
</script>

<button class={classes} {...restProps} type="button" on:click={() => onClick?.()}>
{#if children}
{@render children()}
{:else}
<slot />
{/if}
<ChevronDown size={16} class="opacity-50" />
</button>
