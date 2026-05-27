<script lang="ts">
  import { CircleIcon } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  interface Props {
    class?: string;
    value?: string;
    disabled?: boolean;
    required?: boolean;
    checked?: boolean;
    'onUpdate:checked'?: (checked: boolean) => void;
    [key: string]: any;
  }

  let {
    class: className,
    value,
    disabled = false,
    required = false,
    checked = false,
    'onUpdate:checked': updateChecked,
    ...restProps
  }: Props = $props();

  const classes = $derived(
    cn(
      'border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aspect-square size-4 shrink-0 cursor-pointer rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )
  );

  function handleClick() {
    if (!disabled && updateChecked) {
      updateChecked(true);
    }
  }
</script>

<button
  type="button"
  role="radio"
  aria-checked={checked}
  {disabled}
  {required}
  class={classes}
  onclick={handleClick}
  {...restProps}
>
  {#if checked}
    <div class="relative flex items-center justify-center">
      <CircleIcon class="size-2 fill-current" />
    </div>
  {/if}
  {@render children()}
</button>
