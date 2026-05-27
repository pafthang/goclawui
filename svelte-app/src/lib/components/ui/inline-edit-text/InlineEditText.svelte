<script lang="ts">
  import { Pencil, Loader2 } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  interface Props {
    value: string;
    onSave: (newValue: string) => Promise<void> | void;
    placeholder?: string;
    maxLength?: number;
    minLength?: number;
    multiline?: boolean;
    disabled?: boolean;
    class?: string;
    wrapperClass?: string;
    emptyLabel?: string;
    ariaLabel?: string;
    onValidationError?: (error: string) => void;
  }

  let {
    value,
    onSave,
    placeholder,
    maxLength = 255,
    minLength = 1,
    multiline = false,
    disabled = false,
    class: className,
    wrapperClass: wrapperClassName,
    emptyLabel,
    ariaLabel,
    onValidationError,
  }: Props = $props();

  let editing = $state(false);
  let draft = $state(value);
  let saving = $state(false);
  let savedViaKey = $state(false);
  let initialValue = $state(value);
  let isMounted = $state(true);

  let inputRef: HTMLInputElement | HTMLTextAreaElement | undefined;

  onMount(() => {
    return () => {
      isMounted = false;
    };
  });

  // Sync draft when external value changes AND we are not editing
  $effect(() => {
    if (!editing) draft = value;
  });

  // Focus + select-all on enter edit mode
  $effect(() => {
    if (editing && inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  });

  function startEdit() {
    if (disabled || saving) return;
    initialValue = value;
    draft = value;
    editing = true;
  }

  function cancel() {
    draft = value;
    editing = false;
  }

  async function attemptSave() {
    const trimmed = draft.trim();
    const initial = initialValue.trim();

    if (trimmed === initial) {
      editing = false;
      return;
    }

    if (trimmed.length < minLength) {
      onValidationError?.('minLength');
      inputRef?.focus();
      return;
    }

    if (value.trim() !== initial) {
      onValidationError?.('stale');
      editing = false;
      return;
    }

    saving = true;
    try {
      await onSave(trimmed);
      editing = false;
    } catch {
      draft = value;
      editing = false;
    } finally {
      saving = false;
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
      return;
    }
    if (e.key === 'Enter' && (!multiline || !e.shiftKey)) {
      e.preventDefault();
      savedViaKey = true;
      attemptSave();
    }
  }

  function onBlur() {
    if (savedViaKey) {
      savedViaKey = false;
      return;
    }
    attemptSave();
  }

  function handleChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    draft = target.value;
  }

  const isEmpty = value.trim() === '';
  const display = isEmpty ? (emptyLabel ?? placeholder ?? '') : value;

  const inputBase = cn(
    'w-full min-w-0 rounded-md border border-input bg-transparent px-2 py-1',
    'text-base md:text-sm outline-none transition-shadow',
    'focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:border-ring',
    'disabled:opacity-60'
  );

  const wrapperClasses = $derived(cn('inline-flex items-center gap-1.5 w-full', wrapperClassName));
  const displayClasses = $derived(
    cn(
      'group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 -ml-1 -my-0.5',
      'hover:bg-muted/60 focus-visible:bg-muted/60 outline-none',
      'focus-visible:ring-1 focus-visible:ring-ring/50',
      'disabled:cursor-not-allowed disabled:opacity-60',
      'text-left min-h-[32px] [@media(pointer:coarse)]:min-h-[44px]',
      wrapperClassName
    )
  );
  const textClasses = $derived(cn('truncate', isEmpty && 'italic text-muted-foreground', className));
</script>

{#if editing}
  <div class={wrapperClasses}>
    {#if multiline}
      <textarea
        bind:this={inputRef}
        {value: draft}
        oninput={handleChange}
        onkeydown={onKeyDown}
        onblur={onBlur}
        {maxLength}
        disabled={saving}
        aria-label={ariaLabel}
        aria-invalid={draft.trim().length < minLength}
        {placeholder}
        rows={2}
        class={cn(inputBase, 'resize-none', className)}
      ></textarea>
    {:else}
      <input
        bind:this={inputRef}
        type="text"
        {value: draft}
        oninput={handleChange}
        onkeydown={onKeyDown}
        onblur={onBlur}
        {maxLength}
        disabled={saving}
        aria-label={ariaLabel}
        aria-invalid={draft.trim().length < minLength}
        {placeholder}
        class={cn(inputBase, className)}
      />
    {/if}
    {#if saving}
      <Loader2 class="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
    {/if}
  </div>
{:else}
  <button
    type="button"
    {disabled}
    onclick={(e) => { e.stopPropagation(); startEdit(); }}
    class={displayClasses}
  >
    <span class={textClasses}>
      {display}
    </span>
    <Pencil
      class="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      aria-hidden
    />
  </button>
{/if}
