<script lang="ts">
  import { Info, AlertTriangle, Lightbulb, AlertOctagon, Star } from 'lucide-svelte';

  type CalloutType = 'note' | 'info' | 'warning' | 'tip' | 'danger' | 'important';

  interface CalloutConfig {
    icon: any;
    borderColor: string;
    bgColor: string;
    titleColor: string;
    iconColor: string;
  }

  const CALLOUT_CONFIG: Record<CalloutType, CalloutConfig> = {
    note: {
      icon: Info,
      borderColor: 'border-blue-400 dark:border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      titleColor: 'text-blue-700 dark:text-blue-300',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    info: {
      icon: Info,
      borderColor: 'border-blue-400 dark:border-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      titleColor: 'text-blue-700 dark:text-blue-300',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
    warning: {
      icon: AlertTriangle,
      borderColor: 'border-amber-400 dark:border-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      titleColor: 'text-amber-700 dark:text-amber-300',
      iconColor: 'text-amber-500 dark:text-amber-400',
    },
    tip: {
      icon: Lightbulb,
      borderColor: 'border-green-400 dark:border-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/40',
      titleColor: 'text-green-700 dark:text-green-300',
      iconColor: 'text-green-500 dark:text-green-400',
    },
    danger: {
      icon: AlertOctagon,
      borderColor: 'border-red-400 dark:border-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/40',
      titleColor: 'text-red-700 dark:text-red-300',
      iconColor: 'text-red-500 dark:text-red-400',
    },
    important: {
      icon: Star,
      borderColor: 'border-purple-400 dark:border-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      titleColor: 'text-purple-700 dark:text-purple-300',
      iconColor: 'text-purple-500 dark:text-purple-400',
    },
  };

  interface Props {
    calloutType?: string;
    calloutTitle?: string;
    children?: any;
  }

  let { calloutType, calloutTitle, children }: Props = $props();
  const type = (calloutType as CalloutType) ?? 'note';
  const config = CALLOUT_CONFIG[type] ?? CALLOUT_CONFIG.note;
</script>

<div
  class={`not-prose my-4 rounded-r-md border-l-4 px-4 py-3 ${config.borderColor} ${config.bgColor}`}
>
  <div class={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${config.titleColor}`}>
    <svelte:component this={config.icon} class={`h-4 w-4 shrink-0 ${config.iconColor}`} />
    <span>{calloutTitle}</span>
  </div>
  <div class="prose prose-sm dark:prose-invert max-w-none text-sm">
    <svelte:fragment {@render children?.()} />
  </div>
</div>
