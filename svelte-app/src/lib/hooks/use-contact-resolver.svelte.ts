import { api, type ChannelContact } from '$lib/utils/api';

/**
 * Batch-resolves sender IDs to contact info via GET /v1/contacts/resolve.
 * Results are cached. Returns a resolve() function for lookups.
 */
export function useContactResolver(senderIDs: string[]) {
	let contactMap = $state<Record<string, ChannelContact>>({});
	let loading = $state(false);

	// Deduplicate and filter empty strings
	const uniqueIDs = [...new Set(senderIDs.filter(Boolean))];

	$effect(() => {
		if (uniqueIDs.length === 0) {
			contactMap = {};
			return;
		}

		let cancelled = false;
		loading = true;

		async function fetchContacts() {
			try {
				const res = await api.users.resolve(uniqueIDs);
				if (!cancelled) {
					contactMap = res.contacts ?? {};
				}
			} catch (error) {
				console.error('Failed to resolve contacts:', error);
				if (!cancelled) {
					contactMap = {};
				}
			} finally {
				if (!cancelled) {
					loading = false;
				}
			}
		}

		fetchContacts();

		return () => {
			cancelled = true;
		};
	});

	/** Resolve a sender_id to its contact info, or null if not found. */
	const resolve = (id: string): ChannelContact | null => {
		return contactMap[id] ?? null;
	};

	return { resolve, loading, contactMap };
}
