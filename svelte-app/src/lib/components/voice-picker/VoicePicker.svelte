<script lang="ts">
  import { onMount } from 'svelte';
  import type { TtsProviderId } from '$data/tts-providers';

  interface Props {
    value?: string;
    onChange?: (id: string) => void;
    disabled?: boolean;
    provider?: TtsProviderId | '';
    placeholder?: string;
  }

  let {
    value = '',
    onChange = () => {},
    disabled = false,
    provider = '',
    placeholder
  }: Props = $props();
</script>

{#if provider === ''}
  <!-- Empty state picker -->
  <button
    type="button"
    disabled
    class="border-input dark:bg-input/30 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-base md:text-sm shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 text-muted-foreground"
  >
    <span class="truncate">
      {placeholder ?? 'Сначала выберите провайдера'}
    </span>
    <svg class="size-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
{:else}
  <!-- Placeholder for full VoicePicker with capabilities dispatch -->
  <div class="text-sm text-muted-foreground">
    VoicePicker: provider="{provider}" (requires API integration)
  </div>
{/if}
