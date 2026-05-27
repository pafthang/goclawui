<script lang="ts">
import { cn } from '$lib/utils';
import type { Snippet } from 'svelte';

interface Props {
class?: string;
size?: 'default' | 'sm' | 'lg';
placeholder?: string;
value?: string;
disabled?: boolean;
required?: boolean;
name?: string;
id?: string;
rows?: number;
children?: Snippet;
[key: string]: unknown;
}

let {
class: className,
size = 'default',
placeholder,
value = $bindable(''),
disabled = false,
required = false,
name,
id,
rows,
children,
...restProps
}: Props = $props();

const baseStyles = 'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

const sizes = {
default: 'min-h-16',
sm: 'min-h-10',
lg: 'min-h-24'
};

let classes = $derived(cn(baseStyles, sizes[size], className));
</script>

<textarea
{placeholder}
bind:value
{disabled}
{required}
{name}
{id}
{rows}
class={classes}
{...restProps}
></textarea>

{#if children}
{@render children()}
{/if}
