<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button/index.svelte';

  interface Props {
    previewUrl?: string;
    voiceName: string;
  }

  let { previewUrl, voiceName }: Props = $props();

  let playing = $state(false);
  let audioRef = $state<HTMLAudioElement | null>(null);

  // Singleton audio element — only one preview plays at a time across all instances.
  let globalAudio: HTMLAudioElement | null = null;
  let globalStop: (() => void) | null = null;

  function stop() {
    if (audioRef) {
      audioRef.pause();
      audioRef.src = '';
      audioRef = null;
    }
    playing = false;
  }

  function handlePlay() {
    if (!previewUrl) return;

    // Stop any other preview that is currently playing.
    if (globalAudio && globalAudio !== audioRef) {
      globalAudio.pause();
      globalAudio.src = '';
      globalStop?.();
    }

    if (playing) {
      stop();
      globalAudio = null;
      globalStop = null;
      return;
    }

    const audio = new Audio(previewUrl);
    audioRef = audio;
    globalAudio = audio;
    globalStop = stop;

    audio.play().catch(() => {
      // Preview URL may have expired — refresh the voice list.
      console.warn('Preview error for', voiceName);
      stop();
      globalAudio = null;
      globalStop = null;
    });

    audio.onended = () => {
      stop();
      if (globalAudio === audio) {
        globalAudio = null;
        globalStop = null;
      }
    };

    audio.onerror = () => {
      console.warn('Preview error for', voiceName);
      stop();
      if (globalAudio === audio) {
        globalAudio = null;
        globalStop = null;
      }
    };

    playing = true;
  }

  $effect(() => {
    return () => {
      // Cleanup on destroy
      if (audioRef) {
        audioRef.pause();
        audioRef = null;
      }
      if (globalAudio === audioRef) {
        globalAudio = null;
        globalStop = null;
      }
    };
  });
</script>

{#if previewUrl}
  <Button
    type="button"
    variant="ghost"
    size="icon-xs"
    title={playing ? `Остановить превью` : `Прослушать ${voiceName}`}
    onclick={handlePlay}
    class="shrink-0"
  >
    {#if playing}
      <!-- StopCircleIcon -->
      <svg class="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke-width="2" />
        <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
      </svg>
    {:else}
      <!-- PlayIcon -->
      <svg class="size-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    {/if}
  </Button>
{/if}
