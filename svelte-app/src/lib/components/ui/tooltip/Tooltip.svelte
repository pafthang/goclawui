<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
open?: boolean;
onOpenChange?: (open: boolean) => void;
delayDuration?: number;
children?: Snippet;
}

let {
open = $bindable(false),
onOpenChange,
delayDuration = 0,
children
}: Props = $props();

function handleOpenChange(newOpen: boolean) {
open = newOpen;
onOpenChange?.(newOpen);
}
</script>

{#if children}
{@render children({ open, onOpenChange: handleOpenChange, delayDuration })}
{/if}
