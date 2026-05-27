<script lang="ts">
  import { Check, X } from 'lucide-svelte';
  import { useTranslation } from 'svelte-i18next';
  import { uniqueId } from '$lib/utils';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Upload, Loader2, FileText } from 'lucide-svelte';

  /** Blocked extensions matching backend tools.blockedExtensions. */
  const BLOCKED_EXTENSIONS = new Set([
    '.exe', '.sh', '.bat', '.cmd', '.ps1', '.com', '.msi', '.scr',
  ]);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB — matches backend tools.MaxFileSizeBytes

  type FileStatus = 'checking' | 'ready' | 'uploading' | 'success' | 'error';

  interface FileEntry {
    id: string;
    file: File;
    status: FileStatus;
    error?: string;
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpload: (file: File) => Promise<void>;
    title?: string;
    description?: string;
  }

  let { open, onOpenChange, onUpload, title, description }: Props = $props();
  let { t } = useTranslation('common');

  let entries = $state<FileEntry[]>([]);
  let uploading = $state(false);
  let done = $state(false);
  let dragging = $state(false);

  function addFiles(fileList: FileList) {
    const existingNames = new Set(entries.map((e) => e.file.name));
    const fresh = Array.from(fileList).filter((f) => !existingNames.has(f.name));
    if (fresh.length === 0) return;

    const newEntries: FileEntry[] = fresh.map((f) => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase();
      if (BLOCKED_EXTENSIONS.has(ext)) {
        return { id: uniqueId(), file: f, status: 'error' as const, error: t('upload.blockedType', { ext }) };
      }
      if (f.size > MAX_FILE_SIZE) {
        return { id: uniqueId(), file: f, status: 'error' as const, error: t('upload.tooLarge') };
      }
      return { id: uniqueId(), file: f, status: 'ready' as const };
    });
    entries = [...entries, ...newEntries];
  }

  function removeEntry(id: string) {
    entries = entries.filter((e) => e.id !== id);
  }

  async function handleSubmit() {
    const readyEntries = entries.filter((e) => e.status === 'ready');
    if (readyEntries.length === 0) return;
    uploading = true;

    for (const entry of readyEntries) {
      entries = entries.map((e) => (e.id === entry.id ? { ...e, status: 'uploading' } : e));
      try {
        await onUpload(entry.file);
        entries = entries.map((e) => (e.id === entry.id ? { ...e, status: 'success' } : e));
      } catch (err) {
        entries = entries.map((e) =>
          e.id === entry.id
            ? { ...e, status: 'error', error: err instanceof Error ? err.message : t('upload.failed') }
            : e,
        );
      }
    }
    uploading = false;
    done = true;
  }

  function handleClose(v: boolean) {
    if (uploading) return;
    entries = [];
    dragging = false;
    done = false;
    onOpenChange(v);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files.length) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      addFiles(target.files);
    }
    target.value = '';
  }

  const readyCount = $derived(entries.filter((e) => e.status === 'ready').length);
  const successCount = $derived(entries.filter((e) => e.status === 'success').length);
</script>

<Dialog open={open} onOpenChange={handleClose}>
  <DialogContent class="max-h-[80dvh] flex flex-col">
    <DialogHeader>
      <DialogTitle>{title ?? t('upload.title')}</DialogTitle>
      {#if description}
        <DialogDescription>{description}</DialogDescription>
      {/if}
    </DialogHeader>

    <!-- Drop zone -->
    {#if !uploading && !done}
      <div
        role="button"
        tabindex="0"
        class={`flex cursor-pointer flex-col items-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
        }`}
        onclick={() => {
          const input = document.getElementById('file-upload-input') as HTMLInputElement | null;
          input?.click();
        }}
        onkeydown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const input = document.getElementById('file-upload-input') as HTMLInputElement | null;
            input?.click();
          }
        }}
        ondragover={(e: DragEvent) => { e.preventDefault(); dragging = true; }}
        ondragenter={(e: DragEvent) => { e.preventDefault(); dragging = true; }}
        ondragleave={() => dragging = false}
        ondrop={handleDrop}
      >
        <Upload class="h-8 w-8 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">
          {dragging ? t('upload.dropHere') : t('upload.dropOrClick')}
        </p>
        <p class="text-xs text-muted-foreground/60">{t('upload.maxSize')}</p>
        <input
          id="file-upload-input"
          type="file"
          multiple
          class="hidden"
          onchange={handleInputChange}
        />
      </div>
    {/if}

    <!-- File list -->
    {#if entries.length > 0}
      <div class="flex flex-col gap-1 overflow-y-auto max-h-[40dvh]">
        {#each entries as entry (entry.id)}
          <div class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            {#if entry.status === 'checking' || entry.status === 'uploading'}
              <Loader2 class="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
            {:else if entry.status === 'ready'}
              <Check class="h-4 w-4 shrink-0 text-primary" />
            {:else if entry.status === 'success'}
              <Check class="h-4 w-4 shrink-0 text-green-600" />
            {:else if entry.status === 'error'}
              <X class="h-4 w-4 shrink-0 text-destructive" />
            {/if}
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="truncate font-medium">{entry.file.name}</span>
                <span class="shrink-0 text-xs text-muted-foreground">
                  {(entry.file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              {#if entry.status === 'error' && entry.error}
                <p class="text-xs text-destructive truncate">{entry.error}</p>
              {/if}
            </div>
            {#if !uploading && entry.status !== 'uploading' && entry.status !== 'success'}
              <button
                type="button"
                onclick={(e: MouseEvent) => { e.stopPropagation(); removeEntry(entry.id); }}
                class="shrink-0 rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <X class="h-3.5 w-3.5" />
              </button>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    <!-- Summary -->
    {#if entries.length > 0 && !done && !uploading}
      <p class="text-xs text-muted-foreground">
        {t('upload.readyCount', { ready: readyCount, total: entries.length })}
      </p>
    {/if}
    {#if done}
      <p class="text-sm font-medium text-muted-foreground">
        {t('upload.successCount', { success: successCount, total: entries.length })}
      </p>
    {/if}

    <DialogFooter>
      <Button variant="outline" onclick={() => handleClose(false)} disabled={uploading}>
        {t('cancel')}
      </Button>
      {#if done}
        <Button onclick={() => handleClose(false)}>{t('done', 'Done')}</Button>
      {:else}
        <Button onclick={handleSubmit} disabled={readyCount === 0 || uploading}>
          {#if uploading}
            {t('upload.uploading')}
          {:else}
            {t('upload.uploadCount', { count: readyCount })}
          {/if}
        </Button>
      {/if}
    </DialogFooter>
  </DialogContent>
</Dialog>
