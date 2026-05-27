<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
open?: boolean;
onOpenChange?: (open: boolean) => void;
children?: Snippet<[Props]>;
}

let {
open = $bindable(false),
onOpenChange,
children
}: Props = $props();

function handleOpenChange(newOpen: boolean) {
open = newOpen;
onOpenChange?.(newOpen);
}
</script>

{#if children}
{@render children({ open, onOpenChange: handleOpenChange })}
{/if}
