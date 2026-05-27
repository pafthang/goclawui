import { api, type UserPickerItem, type ChannelContact } from '$lib/utils/api';

/** Unified search result from contacts + tenant_users. */
export interface UserPickerOptions {
	results: UserPickerItem[];
	options: ComboboxOption[];
	loading: boolean;
}

export interface ComboboxOption {
	value: string;
	label: string;
}

/**
 * Unified user picker hook — searches both channel_contacts and tenant_users.
 * - Empty search: returns 30 most recent
 * - With search: debounced server-side ILIKE search
 * - Deduplicates merged contacts (shows tenant_user badge instead)
 */
export function useUserPicker(
	search: string,
	peerKind?: string,
	source?: 'contact' | 'tenant_user',
	valueMode?: 'user_id' | 'uuid'
): UserPickerOptions {
	let debouncedSearch = $state(search);
	let results = $state<UserPickerItem[]>([]);
	let loading = $state(false);

	// Debounce search
	$effect(() => {
		const timer = setTimeout(() => {
			debouncedSearch = search;
		}, 150);
		return () => clearTimeout(timer);
	});

	// Fetch data when debounced search changes
	$effect(() => {
		let cancelled = false;
		loading = true;

		async function fetchData() {
			try {
				const params: Record<string, string> = { limit: '30' };
				if (debouncedSearch) params.q = debouncedSearch;
				if (peerKind) params.peer_kind = peerKind;
				if (source) params.source = source;

				const res = await api.users.search(params);
				if (!cancelled) {
					results = res.results ?? [];
				}
			} catch (error) {
				console.error('Failed to fetch users:', error);
				if (!cancelled) {
					results = [];
				}
			} finally {
				if (!cancelled) {
					loading = false;
				}
			}
		}

		fetchData();

		return () => {
			cancelled = true;
		};
	});

	// Format results as ComboboxOptions with source badges
	const options: ComboboxOption[] = $derived(
		results.map((r) => {
			const parts: string[] = [];
			if (r.display_name) parts.push(r.display_name);
			if (r.username) parts.push(`@${r.username}`);
			parts.push(`(${r.id})`);
			if (r.source === 'contact' && r.channel_type) parts.push(`[${r.channel_type}]`);
			if (r.source === 'tenant_user') parts.push('[tenant]');
			if (r.merged_tenant_user_id) parts.push(`→ ${r.merged_tenant_user_id}`);
			const value =
				valueMode === 'uuid' && r.source === 'tenant_user' && r.uuid ? r.uuid : r.id;
			return { value, label: parts.join(' ') };
		})
	);

	return { results, options, loading };
}
