<!-- Alias for backward compatibility - RequireCrossTenant is deprecated, use RequireOwner instead -->
<script lang="ts">
	import RequireOwner from './RequireOwner.svelte';
	import type { Snippet } from 'svelte';
	
	interface Props {
		children: Snippet;
	}
	
	const { children }: Props = $props();
</script>

<RequireOwner>
	{@render children()}
</RequireOwner>
