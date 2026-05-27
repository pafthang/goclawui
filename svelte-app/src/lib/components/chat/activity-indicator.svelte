<script lang="ts">
	import { Brain, Wrench, Pencil, Archive, RefreshCw, Users } from 'lucide-svelte';
	import type { RunActivity } from '$lib/types/chat';

	interface Props {
		activity: RunActivity | null;
		isRunning: boolean;
	}

	let { activity, isRunning }: Props = $props();

	function getPhaseConfig(activity: RunActivity) {
		switch (activity.phase) {
			case 'thinking':
				return { icon: Brain, animation: 'animate-pulse', color: 'text-amber-500', label: 'Thinking...' };
			case 'tool_exec':
				return {
					icon: Wrench,
					animation: 'animate-wobble',
					color: 'text-blue-500',
					label: activity.tool ? `Running ${activity.tool}...` : 'Running tools...'
				};
			case 'streaming':
				return { icon: Pencil, animation: '', color: 'text-foreground', label: 'Writing...' };
			case 'compacting':
				return { icon: Archive, animation: 'animate-pulse', color: 'text-amber-500', label: 'Optimizing context...' };
			case 'retrying':
				return {
					icon: RefreshCw,
					animation: 'animate-spin',
					color: 'text-amber-500',
					label: `Retrying (${activity.retryAttempt ?? 0}/${activity.retryMax ?? 0})...`
				};
			case 'leader_processing':
				return { icon: Users, animation: 'animate-pulse', color: 'text-emerald-500', label: 'Processing team results...' };
			default:
				return { icon: Brain, animation: 'animate-pulse', color: 'text-muted-foreground', label: 'Working...' };
		}
	}
</script>

{#if isRunning || activity?.phase === 'leader_processing'}
	{#if !activity}
		<div class="flex items-center gap-1 px-1 py-1">
			<span class="flex gap-1">
				<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
				<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
				<span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
			</span>
		</div>
	{:else}
		{@const config = getPhaseConfig(activity)}
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<svelte:component this={config.icon} class="h-4 w-4 {config.animation} {config.color}" />
			<span class={config.color}>{config.label}</span>
			{#if activity.phase !== 'retrying' && activity.iteration && activity.iteration > 1}
				<span class="text-muted-foreground">· Step {activity.iteration}</span>
			{/if}
		</div>
	{/if}
{/if}
