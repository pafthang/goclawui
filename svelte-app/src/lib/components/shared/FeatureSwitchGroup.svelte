<script lang="ts">
  import type { LucideIcon } from 'lucide-svelte';
  import { Info } from 'lucide-svelte';
  import { cn } from '$lib/utils';
  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';

  export interface FeatureSwitchItem {
    icon?: any;
    iconClass?: string;
    label: string;
    hint: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
    infoWhenOn?: string;
    infoClass?: string;
  }

  interface Props {
    title: string;
    description?: string;
    items: FeatureSwitchItem[];
    highlight?: boolean;
  }

  let { title, description, items, highlight }: Props = $props();
</script>

<Card class={cn(highlight && 'border-primary/20 bg-primary/[0.02]')}>
  <CardHeader class="pb-3">
    <CardTitle class="text-base">{title}</CardTitle>
    {#if description}
      <CardDescription>{description}</CardDescription>
    {/if}
  </CardHeader>
  <CardContent class="space-y-0">
    {#each items.map((item, i) => ({ item, i })) as { item, i }}
      <div
        class={cn(
          'py-4',
          i < items.length - 1 && 'border-b'
        )}
      >
        <!-- Header row: icon + label ... switch -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            {#if item.icon}
              <svelte:component this={item.icon} class={cn('h-4 w-4 shrink-0', item.iconClass ?? 'text-muted-foreground')} />
            {/if}
            <div class="space-y-1">
              <Label class="text-sm font-medium">{item.label}</Label>
              <p class="text-xs text-muted-foreground">{item.hint}</p>
            </div>
          </div>
          <Switch
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            class="shrink-0"
          />
        </div>

        <!-- Conditional info box when enabled -->
        {#if item.checked && item.infoWhenOn}
          <div class={cn(
            'mt-3 flex items-start gap-2 rounded-md border px-3 py-2 text-xs',
            item.infoClass ?? 'border-primary/20 bg-primary/5 text-primary dark:bg-primary/10'
          )}>
            <Info class="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{item.infoWhenOn}</span>
          </div>
        {/if}
      </div>
    {/each}
  </CardContent>
</Card>
