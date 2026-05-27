<script lang="ts">
  import { Info } from 'lucide-svelte';
  import { Label } from '$lib/components/ui/label';
  import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from '$lib/components/ui/tooltip';

  interface Props {
    children: any;
    tip: string;
  }

  let { children, tip }: Props = $props();
</script>

<div class="flex items-center gap-1.5">
  <Label>{children}</Label>
  <Tooltip>
    <TooltipTrigger>
      <Info class="h-3.5 w-3.5 shrink-0 cursor-help text-muted-foreground" />
    </TooltipTrigger>
    <TooltipContent side="top" class="max-w-64">
      {tip}
    </TooltipContent>
  </Tooltip>
</div>
