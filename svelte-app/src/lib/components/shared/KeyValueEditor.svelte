<script lang="ts">
  import { Plus, Trash2 } from 'lucide-svelte';
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';

  interface KeyValuePair {
    key: string;
    value: string;
  }

  interface Props {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
    keyPlaceholder?: string;
    valuePlaceholder?: string;
    addLabel?: string;
    maskValue?: (key: string) => boolean;
  }

  let {
    value,
    onChange,
    keyPlaceholder = 'Key',
    valuePlaceholder = 'Value',
    addLabel = 'Add',
    maskValue
  }: Props = $props();

  function toEntries(obj: Record<string, string>): KeyValuePair[] {
    const entries = Object.entries(obj).map(([key, val]) => ({ key, value: val }));
    return entries.length > 0 ? entries : [{ key: '', value: '' }];
  }

  function toObject(entries: KeyValuePair[]): Record<string, string> {
    const result: Record<string, string> = {};
    for (const { key, value: val } of entries) {
      if (key.trim()) {
        result[key.trim()] = val;
      }
    }
    return result;
  }

  let entries = $state<KeyValuePair[]>(toEntries(value));
  let internalChange = false;

  $effect(() => {
    if (internalChange) {
      internalChange = false;
      return;
    }
    entries = toEntries(value);
  });

  function emitChange(next: KeyValuePair[]) {
    internalChange = true;
    entries = next;
    onChange(toObject(next));
  }

  function updateEntry(idx: number, patch: Partial<KeyValuePair>) {
    const next = entries.map((e, i) => (i === idx ? { ...e, ...patch } : e));
    emitChange(next);
  }

  function addEntry() {
    entries = [...entries, { key: '', value: '' }];
  }

  function removeEntry(idx: number) {
    const next = entries.filter((_, i) => i !== idx);
    const result = next.length > 0 ? next : [{ key: '', value: '' }];
    emitChange(result);
  }
</script>

<div class="space-y-2">
  {#each entries.map((entry, idx) => ({ entry, idx })) as { entry, idx }}
    <div class="flex items-center gap-2">
      <Input
        value={entry.key}
        oninput={(e: Event) => updateEntry(idx, { key: (e.target as HTMLInputElement).value })}
        placeholder={keyPlaceholder}
        class="flex-1 font-mono text-sm"
      />
      <Input
        type={maskValue?.(entry.key) ? 'password' : 'text'}
        value={entry.value}
        oninput={(e: Event) => updateEntry(idx, { value: (e.target as HTMLInputElement).value })}
        placeholder={valuePlaceholder}
        class="flex-1 font-mono text-sm"
      />
      <Button
        variant="ghost"
        size="icon"
        class="h-9 w-9 shrink-0"
        onclick={() => removeEntry(idx)}
      >
        <Trash2 class="h-3.5 w-3.5 text-muted-foreground" />
      </Button>
    </div>
  {/each}
  <Button variant="outline" size="sm" onclick={addEntry} class="gap-1.5">
    <Plus class="h-3.5 w-3.5" /> {addLabel}
  </Button>
</div>
