<script lang="ts">
	import { X, Download, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { onMount, onDestroy } from 'svelte';

	export interface LightboxImage {
		src: string;
		alt?: string;
		fileName?: string;
		size?: number;
	}

	interface Props {
		src: string;
		alt?: string;
		fileName?: string;
		size?: number;
		onClose: () => void;
		/** Gallery mode: provide images array + currentIndex + onNavigate */
		images?: LightboxImage[];
		currentIndex?: number;
		onNavigate?: (index: number) => void;
	}

	const {
		src,
		alt,
		fileName,
		size,
		onClose,
		images,
		currentIndex,
		onNavigate
	}: Props = $props();

	// Resolve current image — gallery mode uses images[currentIndex], single mode uses props directly
	function resolveCurrentImage(): LightboxImage {
		if (images && currentIndex != null && images[currentIndex]) {
			return images[currentIndex]!;
		}
		return { src, alt, fileName, size };
	}

	let current = $derived(resolveCurrentImage());
	let isGallery = $derived(images && images.length > 1 && onNavigate && currentIndex != null);
	let canPrev = $derived(isGallery && (currentIndex ?? 0) > 0);
	let canNext = $derived(isGallery && (currentIndex ?? 0) < (images?.length ?? 0) - 1);

	const displayName = $derived(current.fileName || current.alt || 'image');
	
	// For simplicity, use src directly (media caching can be added later if needed)
	let cachedSrc = $derived(current.src);

	const navBtnClass =
		'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/90 dark:bg-neutral-800/90 p-2.5 text-neutral-700 dark:text-neutral-200 shadow-md ring-1 ring-black/10 dark:ring-white/10 hover:bg-white dark:hover:bg-neutral-700 transition-colors cursor-pointer';

	const toolbarBtnClass =
		'rounded-full bg-white/90 dark:bg-neutral-800/90 p-2.5 text-neutral-700 dark:text-neutral-200 shadow-md ring-1 ring-black/10 dark:ring-white/10 hover:bg-white dark:hover:bg-neutral-700 transition-colors cursor-pointer';

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
		if (isGallery) {
			if (e.key === 'ArrowLeft' && canPrev && onNavigate) {
				onNavigate((currentIndex ?? 0) - 1);
			}
			if (e.key === 'ArrowRight' && canNext && onNavigate) {
				onNavigate((currentIndex ?? 0) + 1);
			}
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeyDown);
	});

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function toDownloadUrl(url: string): string {
		return url + (url.includes('?') ? '&' : '?') + 'download=true';
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<div
	class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
	onclick={onClose}
>
	<!-- Toolbar -->
	<div class="absolute top-4 right-4 flex items-center gap-2">
		<a
			href={toDownloadUrl(current.src)}
			download={displayName}
			onclick={(e) => e.stopPropagation()}
			class={toolbarBtnClass}
			title="Download"
		>
			<Download class="h-5 w-5" />
		</a>
		<button type="button" onclick={onClose} class={toolbarBtnClass}>
			<X class="h-5 w-5" />
		</button>
	</div>

	<!-- Prev / Next arrows -->
	{#if canPrev}
		<button
			type="button"
			onclick={(e) => { e.stopPropagation(); if (onNavigate) onNavigate((currentIndex ?? 0) - 1); }}
			class={`${navBtnClass} left-4`}
			title="Previous"
		>
			<ChevronLeft class="h-6 w-6" />
		</button>
	{/if}
	{#if canNext}
		<button
			type="button"
			onclick={(e) => { e.stopPropagation(); if (onNavigate) onNavigate((currentIndex ?? 0) + 1); }}
			class={`${navBtnClass} right-4`}
			title="Next"
		>
			<ChevronRight class="h-6 w-6" />
		</button>
	{/if}

	<!-- Image -->
	<img
		src={cachedSrc}
		alt={current.alt ?? 'image'}
		class="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
		onclick={(e) => e.stopPropagation()}
	/>

	<!-- Info bar: counter + filename + size -->
	{#if isGallery || current.fileName || (current.size != null && current.size > 0)}
		<div
			class="mt-3 flex items-center gap-2 rounded-full bg-black/60 px-4 py-1.5 text-sm text-white/90"
			onclick={(e) => e.stopPropagation()}
		>
			{#if isGallery}
				<span class="tabular-nums">{(currentIndex ?? 0) + 1} / {images?.length}</span>
				{(current.fileName || (current.size != null && current.size > 0)) && <span class="text-white/50">·</span>}
			{/if}
			{#if current.fileName}
				<span class="max-w-[300px] truncate">{current.fileName}</span>
			{/if}
			{#if current.fileName && current.size != null && current.size > 0}
				<span class="text-white/50">·</span>
			{/if}
			{#if current.size != null && current.size > 0}
				<span class="text-white/60">{formatSize(current.size)}</span>
			{/if}
		</div>
	{/if}
</div>
