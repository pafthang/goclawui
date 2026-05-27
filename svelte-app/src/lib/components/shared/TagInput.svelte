<script lang="ts">
  import { X } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  interface Props {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    class?: string;
  }

  let {
    value,
    onChange,
    placeholder = 'Type and press Enter',
    class: className
  }: Props = $props();

  let input = $state('');
  let inputRef: HTMLInputElement | null = null;

  function addTag(tag: string) {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    input = '';
  }

  function removeTag(tag: string) {
    onChange(value.filter((v) => v !== tag));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1]!);
    }
  }

  function handleBlur() {
    if (input.trim()) addTag(input);
  }
</script>

<div
  class={cn(
    'border-input dark:bg-input/30 flex min-h-9 flex-wrap items-center gap-1 rounded-md border bg-transparent px-2 py-1 text-sm shadow-xs transition-[color,box-shadow]',
    'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]',
    className
  )}
  onclick={() => inputRef?.focus()}
>
  {#each value as tag}
    <span
      key={tag}
      class="bg-secondary text-secondary-foreground inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs"
    >
      {tag}
      <button
        type="button"
        class="hover:text-destructive ml-0.5"
        onclick={(e) => { e.stopPropagation(); removeTag(tag); }}
      >
        <X class="h-3 w-3" />
      </button>
    </span>
  {/each}
  <input
    bind:this={inputRef}
    value={input}
    oninput={(e: Event) => input = (e.target as HTMLInputElement).value}
    onkeydown={handleKeydown}
    onblur={handleBlur}
    placeholder={value.length === 0 ? placeholder : ''}
    class="placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent py-0.5 text-base md:text-sm outline-none"
  />
</div>
