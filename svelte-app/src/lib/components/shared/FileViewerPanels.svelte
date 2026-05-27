<script lang="ts">
  import { Check, Copy, Download, FileQuestion, Loader2 } from 'lucide-svelte';
  import { useTranslation } from 'svelte-i18next';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { formatSize, sizeBadgeVariant, extOf, langFor, isImageFile, isTextFile, CODE_EXTENSIONS, stripFrontmatter } from '$lib/types/file-helpers';
  import hljs from 'highlight.js/lib/core';
  import typescript from 'highlight.js/lib/languages/typescript';
  import javascript from 'highlight.js/lib/languages/javascript';
  import python from 'highlight.js/lib/languages/python';
  import go from 'highlight.js/lib/languages/go';
  import bash from 'highlight.js/lib/languages/bash';
  import json from 'highlight.js/lib/languages/json';
  import yaml from 'highlight.js/lib/languages/yaml';
  import css from 'highlight.js/lib/languages/css';
  import xml from 'highlight.js/lib/languages/xml';
  import sql from 'highlight.js/lib/languages/sql';
  import rust from 'highlight.js/lib/languages/rust';
  import ruby from 'highlight.js/lib/languages/ruby';
  import java from 'highlight.js/lib/languages/java';
  import c from 'highlight.js/lib/languages/c';
  import cpp from 'highlight.js/lib/languages/cpp';
  import lua from 'highlight.js/lib/languages/lua';
  import MarkdownRenderer from './MarkdownRenderer.svelte';

  // Register languages
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('tsx', typescript);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('jsx', javascript);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('go', go);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('rust', rust);
  hljs.registerLanguage('ruby', ruby);
  hljs.registerLanguage('java', java);
  hljs.registerLanguage('c', c);
  hljs.registerLanguage('cpp', cpp);
  hljs.registerLanguage('lua', lua);

  interface CodeViewerProps {
    content: string;
    language: string;
  }

  function CodeViewer({ content, language }: CodeViewerProps) {
    let { t } = useTranslation('common');
    let copied = $state(false);

    let highlighted = $derived.by(() => {
      if (language && hljs.getLanguage(language)) {
        try {
          return hljs.highlight(content, { language }).value;
        } catch { /* fallback */ }
      }
      return null;
    });

    function copy() {
      navigator.clipboard.writeText(content);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }

    return (
      <div class="group relative overflow-hidden rounded-lg border border-border/60">
        <div class="flex items-center justify-between border-b border-border/40 bg-muted/70 px-3 py-1.5 text-xs-plus font-medium tracking-wide text-muted-foreground uppercase">
          <span>{language || 'text'}</span>
          <button
            type="button"
            onclick={copy}
            class="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
            title={t('copy')}
          >
            {#if copied}
              <Check class="h-3.5 w-3.5" />
            {:else}
              <Copy class="h-3.5 w-3.5" />
            {/if}
          </button>
        </div>
        <pre class="overflow-auto bg-muted/30 p-4 text-[13px] leading-relaxed hljs">
          {#if highlighted}
            {@html highlighted}
          {:else}
            <code class="font-mono-code">{content}</code>
          {/if}
        </pre>
      </div>
    );
  }

  interface CsvViewerProps {
    content: string;
  }

  function CsvViewer({ content }: CsvViewerProps) {
    let { t } = useTranslation('common');
    let copied = $state(false);

    let rows = $derived.by(() => {
      return content.split('\n').filter(Boolean).map((line) => {
        const cols: string[] = [];
        let cur = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') { inQuote = !inQuote; continue; }
          if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; continue; }
          cur += ch;
        }
        cols.push(cur.trim());
        return cols;
      });
    });

    let header = $derived(rows[0]);
    let body = $derived(rows.slice(1));

    function copy() {
      navigator.clipboard.writeText(content);
      copied = true;
      setTimeout(() => copied = false, 2000);
    }

    if (!header || rows.length === 0) {
      return <pre class="text-sm p-4">{content}</pre>;
    }

    return (
      <div class="group relative rounded-lg border border-border/60 flex flex-col overflow-hidden">
        <div class="flex items-center justify-between border-b border-border/40 bg-muted/70 px-3 py-1.5 text-xs-plus font-medium tracking-wide text-muted-foreground uppercase shrink-0">
          <span>{t('csvRows', { count: body.length })}</span>
          <button
            type="button"
            onclick={copy}
            class="cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
            title={t('copy')}
          >
            {#if copied}
              <Check class="h-3.5 w-3.5" />
            {:else}
              <Copy class="h-3.5 w-3.5" />
            {/if}
          </button>
        </div>
        <div class="overflow-auto flex-1 min-h-0">
          <table class="w-full text-[13px] border-collapse">
            <thead class="sticky top-0 z-10">
              <tr class="bg-muted/70">
                {#each header as col, i (i)}
                  <th class="px-3 py-2 text-left text-xs font-semibold tracking-wide border-b border-border/60 whitespace-nowrap">{col}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each body as row, i (i)}
                <tr class="border-b border-border/40 last:border-0 even:bg-muted/30 hover:bg-muted/50">
                  {#each header as _, j (j)}
                    <td class="px-3 py-1.5 border-r border-border/30 last:border-r-0">{row[j] ?? ''}</td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  interface ImageViewerProps {
    path: string;
    fetchBlob: (path: string) => Promise<Blob>;
  }

  function ImageViewer({ path, fetchBlob }: ImageViewerProps) {
    let { t } = useTranslation('common');
    let src = $state<string | null>(null);
    let loading = $state(true);
    let error = $state(false);

    $effect(() => {
      let objectUrl: string | null = null;
      loading = true;
      error = false;

      fetchBlob(path)
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          src = objectUrl;
        })
        .catch(() => error = true)
        .finally(() => loading = false);

      return () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    });

    if (loading) {
      return (
        <div class="flex items-center justify-center py-12">
          <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error || !src) {
      return (
        <div class="flex items-center justify-center py-12 text-sm text-muted-foreground">
          {t('failedToLoadImage')}
        </div>
      );
    }

    return (
      <div class="flex items-center justify-center p-4">
        <img
          src={src}
          alt={path.split('/').pop() ?? ''}
          class="max-w-full max-h-[70vh] object-contain rounded-lg border border-border/40"
        />
      </div>
    );
  }

  interface UnsupportedFileViewerProps {
    path: string;
    size: number;
    onDownload?: () => void;
  }

  function UnsupportedFileViewer({ path, size, onDownload }: UnsupportedFileViewerProps) {
    let { t } = useTranslation('storage');
    let fileName = $derived(path.split('/').pop() ?? path);

    return (
      <div class="flex flex-col items-center justify-center py-16 gap-4">
        <FileQuestion class="h-12 w-12 text-muted-foreground/50" />
        <p class="text-sm text-muted-foreground">{t('unsupportedFile')}</p>
        {#if onDownload}
          <Button variant="outline" size="sm" onclick={onDownload}>
            <Download class="h-3.5 w-3.5 mr-1.5" />
            {fileName}
            <Badge variant={sizeBadgeVariant(size)} class="text-2xs ml-1.5">
              {formatSize(size)}
            </Badge>
          </Button>
        {/if}
      </div>
    );
  }

  export { CodeViewer, CsvViewer, ImageViewer, UnsupportedFileViewer };
</script>
