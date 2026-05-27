<script lang="ts">
import { cn } from '$lib/utils';
import { Check } from 'lucide-svelte';
import type { Snippet } from 'svelte';

interface Props {
value: string;
class?: string;
children?: Snippet;
selected?: boolean;
onSelect?: (value: string) => void;
[key: string]: unknown;
}

let {
value,
class: className,
children,
selected = false,
onSelect,
...restProps
}: Props = $props();

let classes = $derived(
cn(
'focus:bg-accent focus:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
className
)
);
</script>

<div
class={classes}
{...restProps}
role="option"
aria-selected={selected}
on:click={() => onSelect?.(value)}
>
<span class="absolute right-2 flex size-3.5 items-center justify-center">
{#if selected}
<Check size={16} />
{/if}
</span>
{#if children}
{@render children()}
{:else}
<slot />
{/if}
</div>
