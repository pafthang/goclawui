<script lang="ts">
	import { User, Bot } from 'lucide-svelte';
	import MessageContent from './message-content.svelte';
	import ThinkingBlock from './thinking-block.svelte';
	import ToolCallCard from './tool-call-card.svelte';
	import BlockReplyBubble from './block-reply-bubble.svelte';
	import MediaGallery from './media-gallery.svelte';
	import { useUiStore } from '$lib/stores/use-ui-store.svelte';
	import { resolveTimezone } from '$lib/utils/format';
	import type { ChatMessage } from '$lib/types/chat';

	interface Props {
		message: ChatMessage;
	}

	let { message }: Props = $props();
	let timezone = useUiStore((s) => s.timezone);

	let isUser = $derived(message.role === 'user');
	let isTool = $derived(message.role === 'tool');
	let isAssistant = $derived(message.role === 'assistant');
	let hasThinking = $derived(isAssistant && !!message.thinking);
	let hasToolDetails = $derived(isAssistant && message.toolDetails && message.toolDetails.length > 0);
	let hasToolCalls = $derived(isAssistant && message.tool_calls && message.tool_calls.length > 0);
	let hasContent = $derived(!!message.content?.trim());
	let isToolOnly = $derived(isAssistant && !hasContent && !hasThinking && (hasToolDetails || hasToolCalls));
</script>

{#if isTool || message.isNotification}
	<!-- Render nothing for tool/notification messages -->
{:else if message.isBlockReply}
	<BlockReplyBubble {message} />
{:else if isAssistant && !hasContent && !hasToolCalls && !hasToolDetails}
	<!-- Render nothing for empty assistant messages -->
{:else}
	<div class="flex gap-3" class:flex-row-reverse={isUser}>
		<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background">
			{#if isUser}
				<User class="h-4 w-4" />
			{:else}
				<Bot class="h-4 w-4" />
			{/if}
		</div>

		{#if isToolOnly}
			<!-- Compact tool-only card — no bubble wrapper, full width -->
			<div class="flex-1 min-w-0 rounded-md border bg-muted divide-y divide-border">
				{#if hasThinking}
					<div class="px-2 py-1.5">
						<ThinkingBlock text={message.thinking!} />
					</div>
				{/if}
				{#each message.toolDetails ?? [] as entry}
					<ToolCallCard {entry} compact={true} />
				{/each}
			</div>
		{:else}
			<!-- Normal message bubble — assistant uses full width, user capped at 85% -->
			<div
				class="rounded-lg px-4 py-2 bg-card text-card-foreground border border-border shadow-sm"
				class:max-w-\[85\%\]={isUser}
				class:border-r-2={isUser}
				class:border-r-accent-foreground={isUser}
			>
				{#if hasThinking}
					<div class="mb-2">
						<ThinkingBlock text={message.thinking!} />
					</div>
				{/if}
				{#if hasToolDetails}
					<div class="mb-2 rounded-md border bg-muted divide-y divide-border">
						{#each message.toolDetails! as entry}
							<ToolCallCard {entry} compact={true} />
						{/each}
					</div>
				{/if}
				<MessageContent
					content={message.content}
					role={message.role}
					mediaBasenames={message.mediaItems?.map((m) => m.path.split('/').pop() ?? '').filter(Boolean)}
				/>
				{#if message.mediaItems && message.mediaItems.length > 0}
					<div class="mt-2">
						<MediaGallery items={message.mediaItems} />
					</div>
				{/if}
				{#if message.timestamp}
					<div class="mt-1 text-2xs text-muted-foreground">
						{new Intl.DateTimeFormat([], {
							timeZone: resolveTimezone(timezone),
							hour: 'numeric',
							minute: '2-digit'
						}).format(new Date(message.timestamp))}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}
