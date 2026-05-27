<script lang="ts">
	import { Combobox, type ComboboxOption } from '$lib/components/ui/combobox/Combobox.svelte';
	import { useUserPicker } from '$lib/hooks/use-user-picker.svelte';

	interface Props {
		value: string;
		onChange: (value: string) => void;
		onSelect?: (value: string) => void;
		placeholder?: string;
		class?: string;
		peerKind?: 'direct' | 'group';
		source?: 'contact' | 'tenant_user';
		valueMode?: 'user_id' | 'uuid';
		allowCustom?: boolean;
		portalContainer?: HTMLElement | null;
	}

	let {
		value,
		onChange,
		onSelect,
		placeholder,
		class: className,
		peerKind,
		source,
		valueMode,
		allowCustom = true,
		portalContainer,
	}: Props = $props();

	const { options } = useUserPicker(value, peerKind, source, valueMode);
</script>

<Combobox
	{value}
	onChange={onChange}
	onSelect={onSelect}
	{options}
	{placeholder}
	class={className}
	{allowCustom}
	{portalContainer}
/>
