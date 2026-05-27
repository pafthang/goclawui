<script lang="ts">
  import { LayoutGrid, List } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';

  interface Props {
    mode: 'card' | 'list';
    onChange: (mode: 'card' | 'list') => void;
  }

  let { mode, onChange }: Props = $props();
</script>

<div class="ml-auto flex items-center gap-0.5 rounded-md border p-0.5">
  <Tooltip>
    <TooltipTrigger>
      <Button
        variant={mode === 'card' ? 'default' : 'ghost'}
        size="xs"
        class="h-7 w-7 p-0"
        onclick={() => onChange('card')}
      >
        <LayoutGrid class="h-3.5 w-3.5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Card view</TooltipContent>
  </Tooltip>
  <Tooltip>
    <TooltipTrigger>
      <Button
        variant={mode === 'list' ? 'default' : 'ghost'}
        size="xs"
        class="h-7 w-7 p-0"
        onclick={() => onChange('list')}
      >
        <List class="h-3.5 w-3.5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>List view</TooltipContent>
  </Tooltip>
</div>
