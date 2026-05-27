<script lang="ts">
  import { cn } from '$lib/utils';

  type Status = 'success' | 'warning' | 'error' | 'info' | 'default';

  const statusClasses: Record<Status, string> = {
    success: 'bg-green-500/15 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-500/15 text-red-600 dark:text-red-400',
    info: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    default: 'bg-muted text-muted-foreground',
  };

  const dotClasses: Record<Status, string> = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    default: 'bg-muted-foreground',
  };

  interface Props {
    status: Status;
    label: string;
    class?: string;
  }

  let { status, label, class: className }: Props = $props();
</script>

<span
  class={cn(
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
    statusClasses[status],
    className
  )}
>
  <span class={cn('h-1.5 w-1.5 rounded-full', dotClasses[status])} />
  {label}
</span>
