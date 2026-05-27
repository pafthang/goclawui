<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
value?: string;
onValueChange?: (value: string) => void;
open?: boolean;
onOpenChange?: (open: boolean) => void;
children?: Snippet;
}

let {
value = $bindable(''),
onValueChange,
open = $bindable(false),
onOpenChange,
children
}: Props = $props();

function handleValueChange(newValue: string) {
value = newValue;
onValueChange?.(newValue);
}

function handleOpenChange(newOpen: boolean) {
open = newOpen;
onOpenChange?.(newOpen);
}
</script>

{#if children}
{@render children({ 
value, 
onValueChange: handleValueChange,
open,
onOpenChange: handleOpenChange
})}
{/if}
