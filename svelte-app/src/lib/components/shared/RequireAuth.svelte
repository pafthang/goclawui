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
	let isRedirecting = $state(false);
	
	onMount(() => {
		const checkAuth = () => {
			const token = authStore.token;
			const userId = authStore.userId;
			const senderID = authStore.senderID;
			const connected = authStore.connected;
			const tenantSelected = authStore.tenantSelected;
			const availableTenants = authStore.availableTenants;
			const isOwner = authStore.isOwner;
			
			// Not authenticated
			if ((!token && !senderID) || !userId) {
				isRedirecting = true;
				goto(ROUTES.LOGIN, { replace: true });
				return false;
			}
			
			// Connected but no tenant selected — show tenant selector
			if (connected && !tenantSelected && availableTenants.length > 0) {
				isRedirecting = true;
				goto(ROUTES.SELECT_TENANT, { replace: true });
				return false;
			}
			
			// Connected, no tenants, not owner — blocked
			if (connected && !tenantSelected && availableTenants.length === 0 && !isOwner) {
				isRedirecting = true;
				goto(ROUTES.SELECT_TENANT, { replace: true });
				return false;
			}
			
			shouldRender = true;
			return true;
		};
		
		checkAuth();
	});
</script>

{#if shouldRender}
	{@render children()}
{/if}
