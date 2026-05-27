<script lang="ts">
import { cn } from '$lib/utils';
import { X } from 'lucide-svelte';
import type { Snippet } from 'svelte';

interface Props {
class?: string;
showCloseButton?: boolean;
overlayTransparent?: boolean;
children?: Snippet;
onClose?: () => void;
[key: string]: unknown;
}

let {
class: className,
showCloseButton = true,
overlayTransparent = false,
children,
onClose,
...restProps
}: Props = $props();

let overlayStyle = $derived(
overlayTransparent ? { background: 'rgba(0,0,0,0.15)' } : undefined
);

let classes = $derived(
cn(
'bg-background fixed z-50 grid w-full gap-4 border p-4 shadow-lg duration-200 outline-none',
'max-sm:inset-0 max-sm:overflow-y-auto max-sm:safe-bottom',
'sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-lg sm:rounded-lg sm:p-6',
className
)
);
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center">
{#if !overlayTransparent}
<div
class="fixed inset-0 bg-black/50"
style={overlayStyle}
on:click={() => onClose?.()}
/>
{:else}
<div
class="fixed inset-0"
style={overlayStyle}
on:click={() => onClose?.()}
/>
{/if}

<div class={classes} {...restProps} role="dialog" aria-modal="true">
{#if children}
{@render children()}
{/if}

{#if showCloseButton}
<button
class="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
on:click={() => onClose?.()}
type="button"
aria-label="Close"
>
<X size={16} />
</button>
{/if}
</div>
</div>
