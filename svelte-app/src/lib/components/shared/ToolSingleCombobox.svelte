<script lang="ts">
  import { ChevronDown } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { t } from '$lib/i18n/translations';

  interface ToolOption {
    name: string;
    displayName: string;
  }

  interface Props {
    value: string;
    onChange: (value: string) => void;
    onToolSelect?: (toolName: string) => void;
    placeholder?: string;
    className?: string;
    tools?: ToolOption[];
  }

  let {
    value,
    onChange,
    onToolSelect,
    placeholder,
    className,
    tools = [],
  }: Props = $props();

  let open = $state(false);
  let search = $state('');
  let containerRef: HTMLDivElement | null = $state(null);
  let inputRef: HTMLInputElement | null = $state(null);
  let dropdownRef: HTMLDivElement | null = $state(null);
  let dropdownStyle = $state<Record<string, string | number>>({});

  // When value changes externally, sync the search field
  $derived(displayValue: string = open ? search : value);

  const filtered = $derived<ToolOption[]>(
    tools.filter(
      (t) => {
        const q = open ? search.toLowerCase() : '';
        return !q || t.name.toLowerCase().includes(q) || t.displayName.toLowerCase().includes(q);
      }
    )
  );

  // Compute dropdown position
  $effect(() => {
    if (!open || !containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    dropdownStyle = {
      position: 'fixed',
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    };
  });

  // Close on outside click
  $effect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef && !containerRef.contains(e.target as Node) &&
        dropdownRef && !dropdownRef.contains(e.target as Node)
      ) {
        open = false;
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  function selectTool(name: string) {
    onChange(name);
    onToolSelect?.(name);
    search = '';
    open = false;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = search.trim();
      if (trimmed) {
        onChange(trimmed);
        const match = tools.find((t) => t.name === trimmed);
        if (match) onToolSelect?.(trimmed);
      }
      search = '';
      open = false;
    }
  }

  function handleFocus() {
    search = value;
    open = true;
  }

  function handleBlur() {
    // Commit typed value on blur if changed
    if (search.trim() && search.trim() !== value) {
      onChange(search.trim());
    }
  }

  function toggleDropdown() {
    if (open) {
      open = false;
    } else {
      search = value;
      open = true;
      inputRef?.focus();
    }
  }
</script>

<div bind:this={containerRef} class={cn('relative', className)}>
  <div
    class={cn(
      'border-input dark:bg-input/30 flex min-h-9 items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow]',
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2'
    )}
    onclick={() => inputRef?.focus()}
  >
    <input
      bind:this={inputRef}
      value={displayValue}
      oninput={(e) => {
        search = e.currentTarget.value;
        if (!open) open = true;
      }}
      onfocus={handleFocus}
      onblur={handleBlur}
      onkeydown={handleKeyDown}
      placeholder={placeholder ?? t('selectOrTypeTools')}
      class="placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent py-0.5 text-base md:text-sm font-mono outline-none"
    />
    <ChevronDown
      class="text-muted-foreground size-4 shrink-0 cursor-pointer opacity-50"
      onmousedown={(e) => e.preventDefault()}
      onclick={toggleDropdown}
    />
  </div>

  {#if open && filtered.length > 0}
    <div
      bind:this={dropdownRef}
      style={dropdownStyle}
      class="bg-popover text-popover-foreground pointer-events-auto max-h-60 overflow-y-auto rounded-md border p-1 shadow-md"
    >
      <div class="text-muted-foreground px-2 py-1 text-2xs font-semibold uppercase tracking-wider">
        {t('builtinTools')}
      </div>
      {#each filtered as tool (tool.name)}
        <button
          type="button"
          onmousedown={(e) => e.preventDefault()}
          onclick={() => selectTool(tool.name)}
          class={cn(
            'hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none',
            tool.name === value && 'bg-accent/50'
          )}
        >
          <span class="truncate">{tool.displayName}</span>
          <code class="text-muted-foreground text-2xs">{tool.name}</code>
        </button>
      {/each}
    </div>
  {/if}
</div>
