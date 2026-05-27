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
	
	/** Check if role meets minimum level. Owner > Admin > Operator > Viewer. */
	function hasMinRole(role: string, minRole: string): boolean {
		const levels: Record<string, number> = { owner: 4, admin: 3, operator: 2, viewer: 1 };
		return (levels[role] ?? 0) >= (levels[minRole] ?? 0);
	}
	
	onMount(() => {
		const role = authStore.role;
		
		if (!hasMinRole(role, 'admin')) {
			goto(ROUTES.OVERVIEW, { replace: true });
			return;
		}
		
		shouldRender = true;
	});
</script>

{#if shouldRender}
	{@render children()}
{/if}
