<script lang="ts">
	import type { ChatMessage } from '$lib/types/chat';
	import MarkdownRenderer from '$lib/components/shared/MarkdownRenderer.svelte';

	interface Props {
		message: ChatMessage;
	}

	let { message }: Props = $props();
</script>

<div class="border-l-2 border-muted-foreground/30 pl-3 py-1">
	<div class="text-sm text-muted-foreground italic">
		<MarkdownRenderer content={message.content} />
	</div>
</div>
