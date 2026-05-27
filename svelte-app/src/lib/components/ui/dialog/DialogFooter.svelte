<script lang="ts">
import { cn } from '$lib/utils';
import type { Snippet } from 'svelte';

interface Props {
class?: string;
showCloseButton?: boolean;
children?: Snippet;
onClose?: () => void;
[key: string]: unknown;
}

let {
class: className,
showCloseButton = false,
children,
onClose,
...restProps
}: Props = $props();

let classes = $derived(
cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)
);
</script>

<div class={classes} {...restProps}>
{#if children}
{@render children()}
{/if}
{#if showCloseButton}
<button
type="button"
class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
on:click={() => onClose?.()}
>
Close
</button>
{/if}
</div>
