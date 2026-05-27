<script lang="ts">
	import { getContext } from 'svelte';
	import type { MediaItem } from '$lib/types/chat';
	import { formatSize, toDownloadUrl } from '$lib/utils/file-helpers';
	import { useMediaUrl } from '$lib/hooks/use-media-url';
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
	import { FileText, FileCode, Music, Film, File, Download } from 'lucide-svelte';

	type MediaType = 'image' | 'audio' | 'video';

	interface ChatImageGalleryContext {
		openImage: (path: string) => void;
	}

	function getImageGalleryContext(): ChatImageGalleryContext {
		return getContext('chatImageGallery');
	}

	interface Props {
		items: MediaItem[];
	}

	let { items }: Props = $props();

	const GENERATED_FILENAME_RE = /^[0-9a-f-]{8,}\.png$/i;

	function formatTimestamp(d: Date): string {
		const pad = (n: number) => String(n).padStart(2, '0');
		return (
			`${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
			`-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
		);
	}

	function resolveImageDownloadName(item: MediaItem): string {
		const base = item.fileName ?? 'image';
		if (item.mimeType === 'image/png' && GENERATED_FILENAME_RE.test(base)) {
			return `generated-${formatTimestamp(new Date())}.png`;
		}
		return base;
	}

	function fileIcon(kind: MediaItem['kind']) {
		switch (kind) {
			case 'document': return FileText;
			case 'code': return FileCode;
			case 'audio': return Music;
			case 'video': return Film;
			default: return File;
		}
	}

	function isMarkdownExt(name: string): boolean {
		return /\.(md|mdx|markdown)$/i.test(name);
	}

	function isMediaKind(kind: string): MediaType | null {
		if (kind === 'image' || kind === 'audio' || kind === 'video') return kind as MediaType;
		return null;
	}

	const { openImage } = getImageGalleryContext();

	let preview: {
		name: string;
		href: string;
		content: string;
		mediaType?: MediaType;
	} | null = $state(null);

	let loading = $state(false);

	function handleFileClick(item: MediaItem) {
		const media = isMediaKind(item.kind);
		if (media) {
			preview = { name: item.fileName ?? 'file', href: item.path, content: '', mediaType: media };
			return;
		}
		// Text/code/document files: fetch content for preview
		loading = true;
		fetch(item.path)
			.then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.text();
			})
			.then((text) => {
				preview = { name: item.fileName ?? 'file', href: item.path, content: text };
			})
			.catch(() => { /* fetch failed — file may not exist yet, ignore */ })
			.finally(() => {
				loading = false;
			});
	}

	const images = $derived(items.filter((i) => i.kind === 'image'));
	const files = $derived(items.filter((i) => i.kind !== 'image'));

	function closePreview() {
		preview = null;
	}
</script>

{#if items.length > 0}
	<div class="space-y-2">
		{#if images.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
				{#each images as item, i}
					<div class="flex flex-col overflow-hidden rounded-lg border">
						<div class="group relative">
							<button
								type="button"
								onclick={() => openImage(item.path)}
								class="block w-full cursor-pointer"
							>
								<img
									src={useMediaUrl(item.path)}
									alt={item.fileName ?? ''}
									class="h-40 w-full object-cover"
									loading="lazy"
								/>
							</button>
							<div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							<div class="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 pb-1.5 opacity-0 transition-opacity group-hover:opacity-100">
								<div class="flex min-w-0 flex-col text-xs text-white drop-shadow-sm">
									{#if item.fileName}
										<span class="truncate">{item.fileName}</span>
									{/if}
									{#if item.size != null && item.size > 0}
										<span class="text-white/70">{formatSize(item.size)}</span>
									{/if}
								</div>
								<a
									href={toDownloadUrl(item.path)}
									download={resolveImageDownloadName(item)}
									onclick={(e) => e.stopPropagation()}
									class="shrink-0 rounded-lg bg-white/90 dark:bg-neutral-800/90 p-1.5 text-neutral-700 dark:text-neutral-200 shadow-md ring-1 ring-black/10 dark:ring-white/10 hover:bg-white dark:hover:bg-neutral-700 transition-colors cursor-pointer"
									title="Download"
								>
									<svelte:component this={Download} class="h-4.5 w-4.5" />
								</a>
							</div>
						</div>
						{#if item.prompt}
							<div
								class="px-2 py-1 text-xs text-muted-foreground italic line-clamp-2"
								title={item.prompt}
							>
								{item.prompt}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		{#if files.length > 0}
			<div class="flex flex-wrap gap-2">
				{#each files as item, i}
					<div class="flex items-center rounded-md border bg-muted/50 text-sm">
						<button
							type="button"
							onclick={() => handleFileClick(item)}
							class="flex items-center gap-2 px-3 py-1.5 hover:bg-muted cursor-pointer rounded-l-md"
						>
							<svelte:component this={fileIcon(item.kind)} class="h-4 w-4 text-muted-foreground" />
							<span class="max-w-[200px] truncate">{item.fileName ?? 'file'}</span>
							{#if item.size != null && item.size > 0}
								<span class="text-xs text-muted-foreground">{formatSize(item.size)}</span>
							{/if}
						</button>
						<a
							href={toDownloadUrl(item.path)}
							download={item.fileName ?? 'file'}
							class="flex items-center px-2 py-1.5 text-muted-foreground hover:bg-muted cursor-pointer rounded-r-md border-l"
							onclick={(e) => e.stopPropagation()}
						>
							<svelte:component this={Download} class="h-3.5 w-3.5" />
						</a>
					</div>
				{/each}
			</div>
		{/if}

		{#if loading}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
				<div class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
			</div>
		{/if}

		{#if preview}
			<Dialog open={!!preview} onOpenChange={closePreview}>
				<DialogContent class="sm:max-w-4xl max-h-[85vh] flex flex-col">
					<DialogHeader class="flex-row items-center gap-2 pr-10">
						<DialogTitle class="truncate text-base flex-1">{preview.name}</DialogTitle>
						<a
							href={toDownloadUrl(preview.href)}
							download={preview.name}
							class="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
						>
							<svelte:component this={Download} class="h-3.5 w-3.5" />
							Download
						</a>
					</DialogHeader>
					<div class="min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/20 p-4">
						{#if preview.mediaType === 'image'}
							<img src={preview.href} alt={preview.name} class="max-w-full rounded" />
						{:else if preview.mediaType === 'audio'}
							<audio controls src={preview.href} class="w-full" />
						{:else if preview.mediaType === 'video'}
							<video controls src={preview.href} class="max-w-full rounded" />
						{:else if isMarkdownExt(preview.name)}
							<!-- MarkdownRenderer component will be added separately -->
							<pre class="whitespace-pre-wrap text-xs font-mono"><code>{preview.content}</code></pre>
						{:else}
							<pre class="whitespace-pre-wrap text-xs font-mono"><code>{preview.content}</code></pre>
						{/if}
					</div>
				</DialogContent>
			</Dialog>
		{/if}
	</div>
{/if}
