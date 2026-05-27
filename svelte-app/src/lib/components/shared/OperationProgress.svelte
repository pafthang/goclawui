<script lang="ts">
  import { CheckCircle2, XCircle, Loader2, Circle } from 'lucide-svelte';

  interface ProgressStep {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'done' | 'error';
    detail?: string;
    current?: number;
    total?: number;
    errorMessage?: string;
  }

  interface Props {
    steps: ProgressStep[];
    elapsed?: number;
    class?: string;
  }

  let { steps, elapsed, class: className }: Props = $props();

  function getStepIcon(status: ProgressStep['status']) {
    switch (status) {
      case 'done':
        return { component: CheckCircle2, class: 'h-4 w-4 shrink-0 text-green-500' };
      case 'error':
        return { component: XCircle, class: 'h-4 w-4 shrink-0 text-destructive' };
      case 'running':
        return { component: Loader2, class: 'h-4 w-4 shrink-0 text-blue-500 animate-spin' };
      default:
        return { component: Circle, class: 'h-4 w-4 shrink-0 text-muted-foreground/40' };
    }
  }
</script>

<div class={`rounded-lg border bg-card p-4 space-y-2.5 ${className ?? ''}`}>
  {#each steps as step}
    <div>
      <div class="flex items-center gap-2 text-sm">
        {@const iconConfig = getStepIcon(step.status)}
        <svelte:component this={iconConfig.component} class={iconConfig.class} />
        <span class={step.status === 'pending' ? 'text-muted-foreground' : ''}>
          {step.label}
        </span>
        <span class="text-xs text-muted-foreground ml-auto">
          {#if step.detail}
            {step.detail}
          {:else if step.status === 'done' && step.total != null && step.total > 0}
            {step.total} items
          {/if}
        </span>
      </div>

      {#if step.status === 'running' && step.total != null && step.total > 0}
        <div class="ml-6 mt-1.5 flex items-center gap-2">
          <div class="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              style="width: {Math.min(100, ((step.current ?? 0) / step.total) * 100)}%"
            />
          </div>
          <span class="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
            {step.current ?? 0}/{step.total}
          </span>
        </div>
      {/if}

      {#if step.status === 'error' && step.errorMessage}
        <p class="ml-6 mt-1 text-xs text-destructive">{step.errorMessage}</p>
      {/if}
    </div>
  {/each}

  {#if elapsed != null}
    <div class="text-xs text-muted-foreground pt-2 border-t">
      {elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`}
    </div>
  {/if}
</div>
