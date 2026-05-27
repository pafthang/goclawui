<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
class?: string;
children?: Snippet<[{ onClick: () => void }]>;
onClick?: () => void;
[key: string]: unknown;
}

let {
class: className,
children,
onClick,
...restProps
}: Props = $props();
</script>

{#if children}
{@render children({ onClick: () => onClick?.() })}
{:else}
<button class={className} {...restProps} on:click={() => onClick?.()}>
<slot />
{/button}
{/if}
