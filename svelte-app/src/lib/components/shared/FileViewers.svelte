<script lang="ts">
  import { Loader2 } from 'lucide-svelte';
  import { useTranslation } from 'svelte-i18next';
  import MarkdownRenderer from './MarkdownRenderer.svelte';
  import { extOf, langFor, stripFrontmatter, isImageFile, isTextFile, CODE_EXTENSIONS } from '$lib/types/file-helpers';
  import { CodeViewer, CsvViewer, ImageViewer, UnsupportedFileViewer } from './FileViewerPanels.svelte';

  interface FileContentBodyProps {
    path: string;
    content: string;
    size?: number;
    fetchBlob?: (path: string) => Promise<Blob>;
    onDownload?: () => void;
  }

  function FileContentBody({ path, content, size, fetchBlob, onDownload }: FileContentBodyProps) {
    const ext = $derived(extOf(path));

    // Image files
    if (isImageFile(path) && fetchBlob) {
      return <ImageViewer path={path} fetchBlob={fetchBlob} />;
    }

    // Text-based files
    if (isTextFile(path) || ext === 'md' || ext === 'csv' || CODE_EXTENSIONS.has(ext)) {
      const displayContent = $derived(ext === 'md' ? stripFrontmatter(content) : content);
      if (ext === 'md') return <MarkdownRenderer content={displayContent} />;
      if (ext === 'csv') return <CsvViewer content={displayContent} />;
      if (CODE_EXTENSIONS.has(ext)) return <CodeViewer content={displayContent} language={langFor(ext)} />;
      return (
        <pre class="whitespace-pre-wrap rounded-md border bg-muted/30 p-4 text-sm">
          {displayContent}
        </pre>
      );
    }

    // Unsupported files
    return <UnsupportedFileViewer path={path} size={size ?? 0} onDownload={onDownload} />;
  }

  interface FileContentPanelProps {
    fileContent: { content: string; path: string; size: number } | null;
    contentLoading: boolean;
    fetchBlob?: (path: string) => Promise<Blob>;
    onDownload?: (path: string) => void;
  }

  function FileContentPanel({ fileContent, contentLoading, fetchBlob, onDownload }: FileContentPanelProps) {
    let { t } = useTranslation('common');

    if (contentLoading) {
      return (
        <div class="flex items-center justify-center py-8">
          <Loader2 class="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (fileContent) {
      return (
        <FileContentBody
          path={fileContent.path}
          content={fileContent.content}
          size={fileContent.size}
          fetchBlob={fetchBlob}
          onDownload={onDownload ? () => onDownload(fileContent.path) : undefined}
        />
      );
    }

    return (
      <div class="flex items-center justify-center py-8 text-sm text-muted-foreground">
        {t('selectFileToView')}
      </div>
    );
  }

  export { FileContentBody, FileContentPanel };
</script>
