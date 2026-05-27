import { browser } from "$app/environment";

interface Options {
	/** Whether the dropdown is currently open. */
	open: boolean;
	/** Invoked when an outside interaction should close the dropdown. */
	onClose: () => void;
	/**
	 * Refs whose DOM subtree is considered "inside". Events originating inside
	 * any of these refs do NOT trigger close. Typically [triggerRef, dropdownRef].
	 */
	ignore: Array<{ current: HTMLElement | null }>;
	/**
	 * Close when the page scrolls OUTSIDE the dropdown. Scrolls that originate
	 * inside the dropdown's own scrollable list are ignored — otherwise touch-
	 * scrolling a long list would close the popup. Default: true.
	 */
	closeOnOutsideScroll?: boolean;
	/** Close on window resize (position would be stale). Default: true. */
	closeOnResize?: boolean;
	/** Close on Escape key. Default: true. */
	closeOnEscape?: boolean;
}

/**
 * Svelte 5 version of usePortalDropdownClose for portaled dropdowns.
 * Uses runes and $effect for lifecycle management.
 */
export function usePortalDropdownClose({
	open,
	onClose,
	ignore,
	closeOnOutsideScroll = true,
	closeOnResize = true,
	closeOnEscape = true,
}: Options) {
	$effect(() => {
		if (!open || !browser) return;

		const isInside = (event: Event): boolean => {
			const nodes = ignore.map((r) => r.current).filter((n): n is HTMLElement => n != null);
			const path = typeof event.composedPath === "function" ? event.composedPath() : [];
			if (path.length > 0) {
				return path.some((n) => nodes.includes(n as HTMLElement));
			}
			const target = event.target as Node | null;
			if (!target) return false;
			return nodes.some((n) => n.contains(target));
		};

		const handlePointerDown = (event: PointerEvent) => {
			if (!isInside(event)) onClose();
		};
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		const handleScroll = (event: Event) => {
			if (!isInside(event)) onClose();
		};
		const handleResize = () => onClose();

		// Defer install so the opening pointerdown isn't re-delivered to the
		// listener on touch devices.
		const installId = window.setTimeout(() => {
			document.addEventListener("pointerdown", handlePointerDown);
			if (closeOnEscape) document.addEventListener("keydown", handleEscape);
			if (closeOnOutsideScroll) window.addEventListener("scroll", handleScroll, true);
			if (closeOnResize) window.addEventListener("resize", handleResize);
		}, 0);

		return () => {
			window.clearTimeout(installId);
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleEscape);
			window.removeEventListener("scroll", handleScroll, true);
			window.removeEventListener("resize", handleResize);
		};
	});
}
