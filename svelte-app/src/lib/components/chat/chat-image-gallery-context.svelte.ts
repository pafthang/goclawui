<script lang="ts">
	import { createContext } from 'svelte/context';
	import { type Writable, writable } from 'svelte/store';

	export type ImageGalleryContextType = {
		open: Writable<boolean>;
		selectedIndex: Writable<number>;
		images: Writable<string[]>;
		openGallery: (images: string[], index: number) => void;
		closeGallery: () => void;
	};

	const key = Symbol('ImageGalleryContext');

	export function createImageGalleryContext(): ImageGalleryContextType {
		const open = writable(false);
		const selectedIndex = writable(0);
		const images = writable<string[]>([]);

		function openGallery(newImages: string[], index: number) {
			images.set(newImages);
			selectedIndex.set(index);
			open.set(true);
		}

		function closeGallery() {
			open.set(false);
		}

		return {
			open,
			selectedIndex,
			images,
			openGallery,
			closeGallery
		};
	}

	export function getImageGalleryContext(): ImageGalleryContextType {
		return getContext(key);
	}

	export function setImageGalleryContext(context: ImageGalleryContextType) {
		setContext(key, context);
	}
</script>
