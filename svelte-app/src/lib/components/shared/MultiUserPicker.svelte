<script lang="ts">
	import { X } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { useContactResolver } from '$lib/hooks/use-contact-resolver.svelte';
	import { formatUserLabel } from '$lib/utils/format-user-label';
	import { UserPickerCombobox } from './UserPickerCombobox.svelte';

	interface Props {
		value: string[];
		onChange: (values: string[]) => void;
		placeholder?: string;
		source?: 'contact' | 'tenant_user';
		peerKind?: 'direct' | 'group';
		allowCustom?: boolean;
		portalContainer?: HTMLElement | null;
	}

	let {
		value,
		onChange,
		placeholder,
		source,
		peerKind,
		allowCustom = true,
		portalContainer,
	}: Props = $props();

	let inputValue = $state('');
	const { resolve } = useContactResolver(value);

	function handleCommit(val: string) {
		const trimmed = val.trim();
		if (trimmed && !value.includes(trimmed)) {
			onChange([...value, trimmed]);
		}
		inputValue = '';
	}

	function removeUser(id: string) {
		onChange(value.filter((v) => v !== id));
	}
</script>

<div class="space-y-2">
	<UserPickerCombobox
		value={inputValue}
		onChange={(v) => (inputValue = v)}
		onSelect={handleCommit}
		{placeholder}
		{source}
		{peerKind}
		{allowCustom}
		{portalContainer}
	/>
	{#if value.length > 0}
		<div class="flex flex-wrap gap-1.5">
			{#each value as id (id)}
				<Badge variant="secondary" class="gap-1 pr-1">
					{formatUserLabel(id, resolve)}
					<button
						type="button"
						onClick={() => removeUser(id)}
						class="relative ml-0.5 cursor-pointer rounded-full p-0.5 hover:bg-muted after:absolute after:-inset-2 after:content-[''] md:after:hidden"
					>
						<X class="h-3 w-3" />
					</button>
				</Badge>
			{/each}
		</div>
	{/if}
</div>
