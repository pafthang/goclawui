<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
placeholder?: string;
value?: string;
children?: Snippet;
}

let {
placeholder,
value = '',
children
}: Props = $props();
</script>

<span data-slot="select-value">
{#if children}
{@render children()}
{:else}
{value || placeholder}
{/if}
</span>
