<script lang="ts">
	import { Image, Video, Mic, FileText, Forward, Reply, MapPin, Download, ChevronRight } from 'lucide-svelte';
	import MarkdownRenderer from '../shared/markdown-renderer.svelte';
	import DialogContent from '$lib/components/ui/dialog/DialogContent.svelte';
	import DialogHeader from '$lib/components/ui/dialog/DialogHeader.svelte';
	import DialogTitle from '$lib/components/ui/dialog/DialogTitle.svelte';
	import { parseRichContent, deduplicateMediaLinks } from './rich-content-parser';
	import { useI18n } from '$lib/i18n/useI18n';

	type MediaType = 'image' | 'video' | 'audio' | 'voice' | 'document' | 'animation';

	const mediaIcons: Record<string, any> = {
		image: Image,
		video: Video,
		audio: Mic,
		voice: Mic,
		document: FileText,
		animation: Video,
	};

	interface Props {
		content: string;
		role: string;
	}

	let { content, role }: Props = $props();
	const { t } = useI18n();

	const cleaned = deduplicateMediaLinks(content);
	const blocks = parseRichContent(cleaned);

	// If no special blocks found, render as plain markdown (fast path)
	const first = blocks[0];
	const isSimpleMarkdown = $derived(blocks.length === 1 && first?.type === 'markdown');

	// Local state for file dialog
	let fileDialogOpen = $state(false);
	let currentFile = $state<{ name: string; mime: string; content: string } | null>(null);

	function openFile(file: { name: string; mime: string; content: string }) {
		currentFile = file;
		fileDialogOpen = true;
	}

	function handleDownload() {
		if (!currentFile) return;
		const blob = new Blob([currentFile.content], { type: currentFile.mime || 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = currentFile.name;
		a.click();
		URL.revokeObjectURL(url);
	}

	/** Whether file content should be rendered as markdown (vs raw code) */
	function isMarkdownFile(name: string, mime: string): boolean {
		return /\.(md|mdx|markdown)$/i.test(name) || mime.startsWith('text/markdown');
	}
</script>

{#if isSimpleMarkdown}
	<MarkdownRenderer content={cleaned} class={role === 'user' ? 'text-sm' : ''} />
{:else}
	<div class="flex flex-col gap-2">
		{#each blocks as block, i}
			{#if block.type === 'forward'}
				<div class="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
					<svelte:component this={Forward} class="h-3.5 w-3.5" />
					<span>
						{t('chat.forwardedFrom')} <span class="font-medium">{block.from}</span>
						{#if block.date}
							<span class="text-amber-600 dark:text-amber-400"> &middot; {block.date}</span>
						{/if}
					</span>
				</div>
			{:else if block.type === 'media'}
				{#const Icon = mediaIcons[block.mediaType] ?? FileText}
				{#const label = t(`chat.media.${block.mediaType}`, { defaultValue: block.mediaType })}
				<span class="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
					<svelte:component this={Icon} class="h-3.5 w-3.5" />
					{label} {t('chat.media.attached')}
				</span>
			{:else if block.type === 'video-notice'}
				<span class="inline-flex items-center gap-1.5 rounded-md border border-muted bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
					<svelte:component this={Video} class="h-3.5 w-3.5" />
					{block.content.replace(/^\[|\]$/g, '')}
				</span>
			{:else if block.type === 'markdown'}
				<MarkdownRenderer content={block.content} class={role === 'user' ? 'text-sm' : ''} />
			{:else if block.type === 'file'}
				{#const fileName = block.name.replace(/\?.*$/, '')}
				<button
					type="button"
					onclick={() => openFile({ name: fileName, mime: block.mime, content: block.content })}
					class="flex w-full cursor-pointer items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-left text-xs font-medium hover:bg-muted/50"
				>
					<svelte:component this={FileText} class="h-3.5 w-3.5 text-muted-foreground" />
					<span class="flex-1 truncate">{fileName}</span>
					<span class="text-muted-foreground font-normal">{block.mime}</span>
					<svelte:component this={ChevronRight} class="h-3.5 w-3.5 text-muted-foreground" />
				</button>
			{:else if block.type === 'reply'}
				<div class="rounded-md border-l-2 border-muted-foreground/40 bg-muted/50 px-3 py-2">
					<div class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<svelte:component this={Reply} class="h-3 w-3" />
						{t('chat.replyingTo')} {block.sender}
					</div>
					<div class="mt-1 text-xs text-muted-foreground/80 line-clamp-3">{block.body}</div>
				</div>
			{:else if block.type === 'location'}
				<span class="inline-flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300">
					<svelte:component this={MapPin} class="h-3.5 w-3.5" />
					{block.lat}, {block.lng}
				</span>
			{/if}
		{/each}
	</div>

	{#if fileDialogOpen && currentFile}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={() => (fileDialogOpen = false)}>
			<div class="bg-background rounded-lg max-w-2xl max-h-[85vh] flex flex-col" onclick={(e) => e.stopPropagation()}>
				<div class="flex-row items-center justify-between gap-2 p-4 border-b flex">
					<h2 class="truncate text-base font-semibold">{currentFile.name}</h2>
					<button
						type="button"
						onclick={handleDownload}
						class="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
					>
						<svelte:component this={Download} class="h-3.5 w-3.5" />
						Download
					</button>
				</div>
				<div class="min-h-0 flex-1 overflow-y-auto p-4">
					{#if isMarkdownFile(currentFile.name, currentFile.mime)}
						<MarkdownRenderer content={currentFile.content} />
					{:else}
						<pre class="whitespace-pre-wrap text-xs font-mono bg-muted/20 rounded p-2">
							<code>{currentFile.content}</code>
						</pre>
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/if}
