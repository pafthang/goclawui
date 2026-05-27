<script lang="ts">
  import { ChevronDownIcon, CheckIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { createPortal } from 'svelte-portal';
  import { onMount, tick } from 'svelte';

  export interface ComboboxOption {
    value: string;
    label?: string;
  }

  interface Props {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (value: string) => void;
    options: ComboboxOption[];
    placeholder?: string;
    class?: string;
    portalContainer?: HTMLElement | null;
    allowCustom?: boolean;
    customLabel?: string;
  }

  let {
    value,
    onChange,
    onSelect,
    options,
    placeholder,
    class: className,
    portalContainer,
    allowCustom = false,
    customLabel = 'Use custom:',
  }: Props = $props();

  let open = $state(false);
  let search = $state('');
  let inputDirty = $state(false);
  let selectedValue = $state<string | null>(null);
  let dropdownStyle = $state<Record<string, any>>({});

  let inputRef: HTMLInputElement | undefined;
  let containerRef: HTMLDivElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  // Sync search text when value changes externally
  $effect(() => {
    if (selectedValue !== null && selectedValue === value) return;
    selectedValue = null;
    const match = options.find((o) => o.value === value);
    search = match?.label || value;
  });

  // Compute filtered options
  const filtered = $derived.by(() => {
    if (!inputDirty || !search) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.value.toLowerCase().includes(q) ||
        (o.label && o.label.toLowerCase().includes(q))
    );
  });

  // Check if typed value is custom
  const isCustomValue = $derived.by(() => {
    if (!search.trim()) return false;
    return !options.some((o) => o.value === search || o.label === search);
  });

  const showCustomHint = $derived(allowCustom && inputDirty && isCustomValue && search.trim());

  // Resolve portal target
  const resolvedPortal = $derived.by(() => {
    if (portalContainer) return portalContainer;
    if (containerRef) {
      const el = containerRef.closest<HTMLElement>('[data-slot="dialog-content"]');
      return el ?? null;
    }
    return null;
  });

  function handleSelect(val: string) {
    selectedValue = val;
    onChange(val);
    onSelect?.(val);
    const match = options.find((o) => o.value === val);
    search = match?.label || val;
    open = false;
    inputDirty = false;
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = target.value;
    selectedValue = null;
    search = val;
    onChange(val);
    if (!inputDirty) {
      inputDirty = true;
    }
    if (!open && options.length > 0) open = true;
  }

  function handleFocus() {
    inputDirty = false;
    if (options.length > 0) open = true;
    tick().then(() => inputRef?.select());
  }

  function toggleOpen() {
    open = !open;
  }

  function closeDropdown() {
    open = false;
    inputDirty = false;
  }

  // Close on outside click
  $effect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef &&
        !containerRef.contains(target) &&
        dropdownRef &&
        !dropdownRef.contains(target)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  });

  // Compute dropdown position
  $effect(() => {
    if (!open || !containerRef) return;

    const inputRect = containerRef.getBoundingClientRect();
    const DROP_H = 256;
    const GAP = 4;
    const spaceBelow = window.innerHeight - inputRect.bottom;
    const flipUp = spaceBelow < DROP_H && inputRect.top > DROP_H;

    if (resolvedPortal) {
      const portalRect = resolvedPortal.getBoundingClientRect();
      const scrollTop = resolvedPortal.scrollTop || 0;
      const scrollLeft = resolvedPortal.scrollLeft || 0;
      const left = inputRect.left - portalRect.left + scrollLeft;
      const maxWidth = portalRect.width - (inputRect.left - portalRect.left);
      const portalRelativeTop = inputRect.top - portalRect.top + scrollTop;
      const portalFlipUp = spaceBelow < DROP_H && portalRelativeTop > DROP_H;

      if (portalFlipUp) {
        const portalH = resolvedPortal.scrollHeight || portalRect.height;
        dropdownStyle = {
          position: 'absolute',
          bottom: portalH - portalRelativeTop + GAP,
          left,
          width: inputRect.width,
          maxWidth,
          maxHeight: DROP_H,
          zIndex: 50,
        };
      } else {
        dropdownStyle = {
          position: 'absolute',
          top: inputRect.bottom - portalRect.top + scrollTop + GAP,
          left,
          width: inputRect.width,
          maxWidth,
          zIndex: 50,
        };
      }
    } else if (flipUp) {
      const bottomFromViewport = window.innerHeight - inputRect.top;
      dropdownStyle = {
        position: 'fixed',
        bottom: bottomFromViewport + GAP,
        left: inputRect.left,
        width: inputRect.width,
        maxHeight: DROP_H,
        zIndex: 9999,
      };
    } else {
      dropdownStyle = {
        position: 'fixed',
        top: inputRect.bottom + GAP,
        left: inputRect.left,
        width: inputRect.width,
        zIndex: 9999,
      };
    }
  });

  const classes = $derived(cn('relative', className));
</script>

<div bind:this={containerRef} class={classes}>
  <input
    bind:this={inputRef}
    type="text"
    value={search}
    oninput={handleInputChange}
    onfocus={handleFocus}
    placeholder={placeholder}
    class={cn(
      'border-input placeholder:text-muted-foreground dark:bg-input/30 h-9 w-full rounded-md border bg-transparent px-3 py-1 pr-8 text-base md:text-sm shadow-xs outline-none transition-[color,box-shadow]',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-1'
    )}
  />
  {#if options.length > 0}
    <ChevronDownIcon
      class="text-muted-foreground absolute top-1/2 right-2.5 size-4 -translate-y-1/2 cursor-pointer opacity-50"
      onclick={toggleOpen}
    />
  {/if}

  {#if open && (filtered.length > 0 || showCustomHint)}
    {#if resolvedPortal}
      {@render portalTemplate()}
    {:else}
      {@render portalTemplate()}
    {/if}
  {/if}
</div>

{#snippet portalTemplate()}
  <div
    bind:this={dropdownRef}
    style={dropdownStyle}
    class="bg-popover text-popover-foreground pointer-events-auto max-h-60 overflow-y-auto rounded-md border p-1 shadow-md"
  >
    {#each filtered as o (o.value)}
      <button
        type="button"
        onmousedown={(e) => e.preventDefault()}
        onclick={() => handleSelect(o.value)}
        class="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none"
      >
        <span class="truncate">{o.label || o.value}</span>
        {#if o.value === value}
          <CheckIcon class="absolute right-2 size-4" />
        {/if}
      </button>
    {/each}
    {#if showCustomHint}
      <button
        type="button"
        onmousedown={(e) => e.preventDefault()}
        onclick={() => handleSelect(search.trim())}
        class="hover:bg-accent hover:text-accent-foreground text-muted-foreground flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 text-sm italic outline-hidden select-none"
      >
        {customLabel} <span class="text-foreground ml-1 font-medium not-italic">{search.trim()}</span>
      </button>
    {/if}
  </div>
{/snippet}
