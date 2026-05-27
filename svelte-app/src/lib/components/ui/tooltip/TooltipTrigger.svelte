<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
class?: string;
children?: Snippet;
onMouseEnter?: () => void;
onMouseLeave?: () => void;
onClick?: () => void;
[key: string]: unknown;
}

let {
class: className,
children,
onMouseEnter,
onMouseLeave,
onClick,
...restProps
}: Props = $props();
</script>

{#if children}
{@render children()}
{:else}
<span
class={className}
{...restProps}
on:mouseenter={() => onMouseEnter?.()}
on:mouseleave={() => onMouseLeave?.()}
on:click={() => onClick?.()}
>
<slot />
</span>
{/if}
