<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { ROUTES } from '$lib/constants/routes';
	import type { Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
	
	let shouldRender = $state(false);
	
	onMount(() => {
		const isOwner = authStore.isOwner;
		
		if (!isOwner) {
			goto(ROUTES.OVERVIEW, { replace: true });
			return;
		}
		
		shouldRender = true;
	});
</script>

{#if shouldRender}
	{@render children()}
{/if}

<!-- @deprecated Use RequireOwner instead. -->
<!-- Alias for backward compatibility -->
