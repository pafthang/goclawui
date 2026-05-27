<script lang="ts">
  import { onMount } from 'svelte';
  import { Badge } from '$lib/components/ui/badge/index.svelte';
  import { Button } from '$lib/components/ui/button/index.svelte';
  import { Skeleton } from '$lib/components/ui/skeleton/index.svelte';
  import { cn } from '$lib/utils';
  import type { VoiceOption } from '$lib/api/tts-capabilities';
  import type { TtsProviderId } from '$data/tts-providers';
  import VoicePreviewButton from '../voice-preview-button.svelte';

  export interface PortalVoice {
    voice_id: string;
    name: string;
    labels?: Record<string, string>;
    preview_url?: string;
  }

  interface Props {
    voices: PortalVoice[];
    value?: string;
    onChange?: (voice_id: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    onRefresh?: () => void;
    allowFreeText?: boolean;
    placeholder?: string;
  }

  let {
    voices = [],
    value = '',
    onChange = () => {},
    disabled = false,
    isLoading = false,
    onRefresh = () => {},
    allowFreeText = false,
    placeholder
  }: Props = $props();

  let open = $state(false);
  let search = $state('');
  let triggerRef = $state<HTMLDivElement | null>(null);
  let dropdownRef = $state<HTMLDivElement | null>(null);
  let dropdownPosition = $state<{ top?: number; bottom?: number; left?: number; width?: number }>({});
  let listboxId = $state(`listbox-${Math.random().toString(36).slice(2)}`);

  const LABEL_KEYS = ['gender', 'accent', 'age', 'use_case', 'style'] as const;

  const selected = $derived(voices.find((v) => v.voice_id === value));

  const filtered = $derived(() => {
    const trimmed = search.trim();
    if (!trimmed) return voices;
    return voices.filter((v) => v.name.toLowerCase().includes(trimmed.toLowerCase()));
  });

  function handleToggle() {
    if (disabled) return;
    open = !open;
    if (open) {
      search = '';
    }
  }

  function handleSelect(voice: PortalVoice) {
    onChange(voice.voice_id);
    open = false;
    search = '';
  }

  function handleRefresh(e: MouseEvent) {
    e.stopPropagation();
    onRefresh();
  }

  function updateDropdownPosition() {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropH = 280;
    
    if (spaceBelow < dropH && rect.top > dropH) {
      dropdownPosition = {
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        width: rect.width
      };
    } else {
      dropdownPosition = {
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      };
    }
  }

  $effect(() => {
    if (open) {
      updateDropdownPosition();
      const handleResize = () => updateDropdownPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  });

  $effect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      if (
        triggerRef && !triggerRef.contains(e.target as Node) &&
        dropdownRef && !dropdownRef.contains(e.target as Node)
      ) {
        open = false;
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  function getPlaceholder(): string {
    return placeholder ?? 'Выберите голос';
  }
</script>

<div class="relative">
  <button
    type="button"
    disabled={disabled}
    onclick={handleToggle}
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={open ? listboxId : undefined}
    class={cn(
      'border-input dark:bg-input/30 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-base md:text-sm shadow-xs transition-[color,box-shadow] outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      !selected && 'text-muted-foreground'
    )}
  >
    <span class="truncate">
      {#if isLoading}
        Загрузка...
      {:else if selected}
        {selected.name}
      {:else}
        {getPlaceholder()}
      {/if}
    </span>
    <svg class="size-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {#if open}
    <div
      bind:this={dropdownRef}
      id={listboxId}
      role="listbox"
      aria-label={getPlaceholder()}
      class="pointer-events-auto z-50 min-w-[280px] rounded-md border bg-popover text-popover-foreground shadow-md"
      style={dropdownPosition}
    >
      <div class="flex items-center gap-1 border-b px-2 py-1.5">
        <input
          autofocus
          bind:value={search}
          placeholder={getPlaceholder()}
          class="flex-1 bg-transparent text-base md:text-sm outline-none placeholder:text-muted-foreground"
        />
        {#if onRefresh}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Обновить"
            disabled={isLoading}
            onclick={handleRefresh}
            class="shrink-0"
          >
            <svg 
              class={cn('size-4', isLoading && 'animate-spin')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        {/if}
      </div>

      <div class="max-h-60 overflow-y-auto p-1">
        {#if isLoading}
          <div class="space-y-1 p-1">
            <Skeleton class="h-8 w-full" />
            <Skeleton class="h-8 w-full" />
            <Skeleton class="h-8 w-full" />
          </div>
        {:else if filtered.length === 0}
          <p class="py-4 text-center text-sm text-muted-foreground">
            {#if voices.length === 0}
              Сначала сохраните конфигурацию
            {:else if search.trim()}
              Голоса не найдены
            {:else}
              Загрузка...
            {/if}
          </p>
        {:else}
          {#each filtered as voice (voice.voice_id)}
            <div
              role="option"
              aria-selected={voice.voice_id === value}
              class={cn(
                'flex items-center gap-2 rounded-sm px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground',
                voice.voice_id === value && 'bg-accent/60'
              )}
              onmousedown={(e) => e.preventDefault()}
              onclick={() => handleSelect(voice)}
            >
              <span class="flex-1 truncate text-sm">{voice.name}</span>
              <div class="flex shrink-0 items-center gap-1">
                {#each LABEL_KEYS.filter((k) => voice.labels?.[k]).slice(0, 2) as labelKey}
                  {@const label = voice.labels![labelKey]}
                  <Badge variant="outline" class="text-xs px-1 py-0">
                    {label}
                  </Badge>
                {/each}
                <VoicePreviewButton {previewUrl: voice.preview_url} voiceName={voice.name} />
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>
