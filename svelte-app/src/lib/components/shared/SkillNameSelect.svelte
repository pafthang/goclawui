<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { X, ChevronDownIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { t } from '$lib/i18n/translations';

  interface Skill {
    name: string;
    description?: string;
  }

  interface Props {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
    skills?: Skill[];
  }

  let {
    value = [],
    onChange,
    placeholder,
    className,
    skills = [],
  }: Props = $props();

  let open = $state(false);
  let search = $state('');
  let containerRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  let dropdownStyle: React.CSSProperties = $state({});

  const filtered = $derived(() => {
    const q = search.toLowerCase();
    return skills
      .filter((s) => !value.includes(s.name))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || (s.description ?? '').toLowerCase().includes(q));
  });

  function updateDropdownPosition() {
    if (!open || !containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    dropdownStyle = {
      position: 'fixed' as const,
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    };
  }

  $effect(() => {
    if (open) {
      updateDropdownPosition();
    }
  });

  // Close on outside click
  $effect(() => {
    if (!open) return;
    
    const handleClick = (e: MouseEvent) => {
      if (containerRef && !containerRef.contains(e.target as Node)) {
        open = false;
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  });

  function addSkill(name: string) {
    if (!value.includes(name)) {
      onChange([...value, name]);
    }
    search = '';
    inputRef?.focus();
  }

  function removeSkill(name: string) {
    onChange(value.filter((v) => v !== name));
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = search.trim().replace(/,$/, '');
      if (trimmed) addSkill(trimmed);
    }
    if (e.key === 'Backspace' && !search && value.length > 0) {
      removeSkill(value[value.length - 1]!);
    }
  }
</script>

<div bind:this={containerRef} class={cn('relative', className)}>
  <div
    class={cn(
      'border-input dark:bg-input/30 flex min-h-9 flex-wrap items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow]',
      'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-2'
    )}
    onclick={() => inputRef?.focus()}
  >
    {#each value as name (name)}
      <span
        class="bg-secondary text-secondary-foreground inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs"
      >
        {name}
        <button
          type="button"
          class="hover:text-destructive ml-0.5"
          onclick={(e) => { e.stopPropagation(); removeSkill(name); }}
        >
          <X class="h-3 w-3" />
        </button>
      </span>
    {/each}
    <input
      bind:this={inputRef}
      value={search}
      oninput={(e) => {
        search = e.currentTarget.value;
        if (!open) open = true;
      }}
      onfocus={() => open = true}
      onkeydown={handleKeyDown}
      placeholder={value.length === 0 ? (placeholder ?? t('selectOrTypeSkills')) : ''}
      class="placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent py-0.5 text-base md:text-sm outline-none"
    />
    <ChevronDownIcon
      class="text-muted-foreground size-4 shrink-0 cursor-pointer opacity-50"
      onclick={() => open = !open}
    />
  </div>
  {#if open && filtered().length > 0}
    <div
      style={dropdownStyle}
      class="bg-popover text-popover-foreground pointer-events-auto max-h-60 overflow-y-auto rounded-md border p-1 shadow-md"
    >
      {#each filtered() as s (s.name)}
        <button
          type="button"
          onmousedown={(e) => e.preventDefault()}
          onclick={() => addSkill(s.name)}
          class="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none"
        >
          <span class="shrink-0 font-medium">{s.name}</span>
          {#if s.description}
            <span class="text-muted-foreground truncate text-xs">{s.description}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

</script>
