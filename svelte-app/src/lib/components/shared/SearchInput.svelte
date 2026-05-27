<script lang="ts">
  import { Search } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';

  interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    class?: string;
    delay?: number;
  }

  let {
    value,
    onChange,
    placeholder = 'Search...',
    class: className,
    delay = 300
  }: Props = $props();

  let localValue = $state(value);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    localValue = value;
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    localValue = target.value;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      onChange(localValue);
    }, delay);
  }
</script>

<div class={`relative ${className ?? ''}`}>
  <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
  <Input
    value={localValue}
    oninput={handleInput}
    placeholder={placeholder}
    class="pl-9"
  />
</div>
