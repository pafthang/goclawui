import { browser } from "$app/environment";

const blobCache = new Map<string, string>();

/**
 * Svelte 5 hook to cache media URLs as blob: URLs to prevent flickering on session switch.
 * Similar to React's useMediaUrl but uses Svelte runes.
 */
export function useMediaUrl(src: string) {
	let cachedSrc = $state(src);

	$effect(() => {
		if (!src || !browser) return;

		// If already cached, use it
		if (blobCache.has(src)) {
			cachedSrc = blobCache.get(src)!;
			return;
		}

		// Fetch and cache as blob
		let cancelled = false;
		
		fetch(src)
			.then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.blob();
			})
			.then((blob) => {
				if (cancelled) return;
				const url = URL.createObjectURL(blob);
				blobCache.set(src, url);
				cachedSrc = url;
			})
			.catch(() => {
				// fetch failed — file may not exist yet, ignore
			});

		return () => {
			cancelled = true;
		};
	});

	return cachedSrc;
}
