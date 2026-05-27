<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    class?: string;
    value?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    modelValue?: string;
    'onUpdate:modelValue'?: (value: string) => void;
    [key: string]: any;
  }

  let {
    class: className,
    value,
    name,
    disabled = false,
    required = false,
    modelValue,
    'onUpdate:modelValue': updateModelValue,
    ...restProps
  }: Props = $props();

  const classes = $derived(
    cn('grid gap-3', className)
  );
</script>

<div
  role="radiogroup"
  {name}
  {disabled}
  {required}
  class={classes}
  {...restProps}
>
  {@render children()}
</div>
