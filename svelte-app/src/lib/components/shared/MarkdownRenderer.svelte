<script lang="ts">
  import { unified } from 'unified';
  import remarkGfm from 'remark-gfm';
  import remarkMath from 'remark-math';
  import rehypeHighlight from 'rehype-highlight';
  import rehypeKatex from 'rehype-katex';
  import remarkWikilinks from '$lib/utils/remark-wikilinks';
  import remarkCallouts from '$lib/utils/remark-callouts';
  import { toFileUrl, toDownloadUrl } from '$lib/types/file-helpers';
  import { Download, FileText } from 'lucide-svelte';
  import ImageLightbox, { type LightboxImage } from './ImageLightbox.svelte';
  import CodeBlock from './CodeBlock.svelte';
  import CachedMarkdownImg from './CachedMarkdownImg.svelte';
  import WikilinkPill from './WikilinkPill.svelte';
  import CalloutBlock from './CalloutBlock.svelte';
  import MermaidBlock from './MermaidBlock.svelte';
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    content: string;
    className?: string;
    onWikilinkClick?: (target: string) => void;
    galleryImages?: LightboxImage[];
  }

  let { content, className, onWikilinkClick, galleryImages }: Props = $props();

  // Stable plugin arrays
  const remarkPlugins = [remarkGfm, remarkMath, remarkWikilinks, remarkCallouts];
  const rehypePlugins = [rehypeHighlight, rehypeKatex];

  // Local file extensions
  const LOCAL_FILE_EXT_RE = /\.(png|jpg|jpeg|gif|webp|svg|bmp|mp3|wav|ogg|flac|aac|m4a|mp4|webm|mkv|avi|mov|pdf|doc|docx|xls|xlsx|csv|txt|md|json|zip)$/i;

  function isFileLink(href: string | undefined): boolean {
    if (!href) return false;
    if (href.startsWith('/v1/files/') || href.includes('/v1/files/')) return true;
    if ((href.startsWith('./') || href.startsWith('../')) && LOCAL_FILE_EXT_RE.test(href)) return true;
    return false;
  }

  function isMarkdownExt(name: string): boolean {
    return /\.(md|mdx|markdown)$/i.test(name);
  }

  function isMediaFile(name: string): 'image' | 'audio' | 'video' | null {
    if (/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)$/i.test(name)) return 'image';
    if (/\.(mp3|wav|ogg|flac|aac|m4a|wma|opus)$/i.test(name)) return 'audio';
    if (/\.(mp4|webm|mkv|avi|mov|wmv)$/i.test(name)) return 'video';
    return null;
  }

  function fileNameFromHref(href: string): string {
    const path = href.split('?')[0] ?? href;
    const segments = path.split('/');
    return segments[segments.length - 1] ?? 'file';
  }

  // Lightbox state
  let lightboxOpen = $state(false);
  let lightboxSrc = $state('');
  let lightboxAlt = $state('');
  let lightboxCurrentIndex = $state<number | undefined>(undefined);

  function openLightbox(src: string, alt: string, index?: number) {
    if (galleryImages && galleryImages.length > 0 && index != null) {
      lightboxCurrentIndex = index;
      lightboxSrc = src;
      lightboxAlt = alt;
      lightboxOpen = true;
    } else {
      lightboxCurrentIndex = undefined;
      lightboxSrc = src;
      lightboxAlt = alt;
      lightboxOpen = true;
    }
  }

  // File preview state
  let filePreviewOpen = $state(false);
  let filePreviewName = $state('');
  let filePreviewHref = $state('');
  let filePreviewContent = $state('');
  let filePreviewMediaType: 'image' | 'audio' | 'video' | undefined = undefined;
  let fileLoading = $state(false);

  let abortController: AbortController | null = null;

  function handleFileClick(href: string, name: string) {
    const media = isMediaFile(name);
    if (media) {
      filePreviewName = name;
      filePreviewHref = href;
      filePreviewContent = '';
      filePreviewMediaType = media;
      filePreviewOpen = true;
      return;
    }

    abortController?.abort();
    const controller = new AbortController();
    abortController = controller;

    fileLoading = true;
    fetch(href, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then((text) => {
        filePreviewName = name;
        filePreviewHref = href;
        filePreviewContent = text;
        filePreviewOpen = true;
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // fetch failed — file may not exist, ignore
        }
      })
      .finally(() => {
        fileLoading = false;
      });
  }

  onMount(() => {
    return () => {
      abortController?.abort();
    };
  });

  // Process markdown to HTML
  let htmlContent = $derived.by(() => {
    try {
      const result = unified()
        .use(remarkPlugins)
        .use(rehypePlugins)
        .processSync(content);
      return String(result.value);
    } catch (e) {
      console.error('Markdown processing error:', e);
      return `<p>Error processing markdown</p>`;
    }
  });

  // Custom component renderer for hast
  function renderCustomComponents(node: any): any {
    if (!node) return null;

    if (node.type === 'element') {
      if (node.tagName === 'wikilink') {
        const target = node.properties?.target ?? '';
        return <WikilinkPill target={target} onClick={onWikilinkClick} />;
      }
      if (node.tagName === 'callout') {
        const calloutType = node.properties?.calloutType ?? 'note';
        const calloutTitle = node.properties?.calloutTitle ?? calloutType;
        return <CalloutBlock calloutType={calloutType} calloutTitle={calloutTitle}>
          {node.children?.map((child: any) => renderCustomComponents(child))}
        </CalloutBlock>;
      }
      if (node.tagName === 'pre') {
        // Check for mermaid
        const codeChild = node.children?.[0];
        if (codeChild?.properties?.className?.includes('language-mermaid')) {
          const code = codeChild.children?.[0]?.value ?? '';
          return <MermaidBlock code={code.replace(/\n$/, '')} />;
        }
        // Regular code block
        return node.children?.map((child: any) => renderCustomComponents(child));
      }
      if (node.tagName === 'code') {
        const className = node.properties?.className ?? '';
        const lang = className.replace('language-', '');
        const isBlock = !!className || String(node.children?.[0]?.value ?? '').includes('\n');
        if (isBlock) {
          const code = node.children?.map((child: any) => child.value ?? '').join('') ?? '';
          return <CodeBlock class={className}>{code}</CodeBlock>;
        }
        // Inline code
        const code = node.children?.map((child: any) => child.value ?? '').join('') ?? '';
        return <code class="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-medium text-primary font-mono-code">{code}</code>;
      }
      if (node.tagName === 'a') {
        const href = node.properties?.href ?? '';
        if (isFileLink(href)) {
          const resolvedHref = toFileUrl(href);
          const name = fileNameFromHref(href);
          return (
            <span class="inline-flex items-center gap-0.5 rounded border bg-muted/50 text-[0.85em] font-medium">
              <button
                type="button"
                class="inline-flex items-center gap-1 px-1.5 py-0.5 text-primary hover:bg-muted cursor-pointer rounded-l"
                onclick={(e: MouseEvent) => {
                  e.preventDefault();
                  handleFileClick(resolvedHref, name);
                }}
              >
                <FileText class="h-3.5 w-3.5" />
                {node.children?.map((child: any) => renderCustomComponents(child))}
              </button>
              <a
                href={toDownloadUrl(resolvedHref)}
                download={name}
                class="inline-flex items-center px-1 py-0.5 text-muted-foreground hover:bg-muted cursor-pointer rounded-r border-l"
                onclick={(e: MouseEvent) => e.stopPropagation()}
              >
                <Download class="h-3 w-3" />
              </a>
            </span>
          );
        }
        return <a href={href} target="_blank" rel="noopener noreferrer">{node.children?.map((child: any) => renderCustomComponents(child))}</a>;
      }
      if (node.tagName === 'img') {
        const src = node.properties?.src ?? '';
        const alt = node.properties?.alt ?? '';
        return <CachedMarkdownImg src={src} alt={alt} openLightbox={openLightbox} />;
      }
      if (node.tagName === 'table') {
        return (
          <div class="not-prose my-4 overflow-x-auto">
            <table class="w-full border-collapse text-[13px]" {...node.properties}>
              {node.children?.map((child: any) => renderCustomComponents(child))}
            </table>
          </div>
        );
      }
      if (node.tagName === 'thead') {
        return <thead {...node.properties}>{node.children?.map((child: any) => renderCustomComponents(child))}</thead>;
      }
      if (node.tagName === 'th') {
        return <th class="border border-border bg-muted px-3 py-1.5 text-left text-[13px] font-semibold" {...node.properties}>{node.children?.map((child: any) => renderCustomComponents(child))}</th>;
      }
      if (node.tagName === 'td') {
        return <td class="border border-border px-3 py-1.5" {...node.properties}>{node.children?.map((child: any) => renderCustomComponents(child))}</td>;
      }
      if (node.tagName === 'tr') {
        return <tr class="even:bg-muted/30" {...node.properties}>{node.children?.map((child: any) => renderCustomComponents(child))}</tr>;
      }
      if (node.tagName === 'blockquote') {
        return (
          <blockquote class="my-4 border-l-4 border-muted-foreground rounded-r-md bg-muted px-4 py-3 text-muted-foreground not-italic" {...node.properties}>
            {node.children?.map((child: any) => renderCustomComponents(child))}
          </blockquote>
        );
      }
      if (node.tagName === 'hr') {
        return <hr class="my-6 border-none h-0.5 bg-border" {...node.properties} />;
      }
      if (node.tagName === 'input' && node.properties?.type === 'checkbox') {
        return <input type="checkbox" checked={node.properties?.checked} disabled class="mr-1" {...node.properties} />;
      }
    }

    // Default: render children
    if (node.children) {
      return node.children.map((child: any) => renderCustomComponents(child));
    }

    return node.value ?? null;
  }

  // Parse HTML and render with custom components
  let renderedContent = $derived.by(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      function processNode(node: Node): any {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const tagName = el.tagName.toLowerCase();
          const props: Record<string, any> = {};
          
          for (const attr of Array.from(el.attributes)) {
            if (attr.name === 'class') {
              props.class = attr.value;
            } else {
              props[attr.name] = attr.value;
            }
          }

          const children = Array.from(el.childNodes).map(processNode);

          // Handle custom tags
          if (tagName === 'wikilink') {
            const target = props.target ?? '';
            return <WikilinkPill target={target} onClick={onWikilinkClick} />;
          }
          if (tagName === 'callout') {
            const calloutType = props.calloutType ?? 'note';
            const calloutTitle = props.calloutTitle ?? calloutType;
            return <CalloutBlock calloutType={calloutType} calloutTitle={calloutTitle}>{children}</CalloutBlock>;
          }
          if (tagName === 'pre') {
            // Check for mermaid in first child
            const firstChild = children[0];
            if (firstChild?.props?.class?.includes('language-mermaid')) {
              const code = firstChild?.children?.[0] ?? '';
              return <MermaidBlock code={String(code).replace(/\n$/, '')} />;
            }
            return children;
          }
          if (tagName === 'code') {
            const className = props.class ?? '';
            const isBlock = !!className || String(children[0] ?? '').includes('\n');
            if (isBlock) {
              const code = Array.isArray(children) ? children.join('') : String(children ?? '');
              return <CodeBlock class={className}>{code}</CodeBlock>;
            }
            const code = Array.isArray(children) ? children.join('') : String(children ?? '');
            return <code class="rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-medium text-primary font-mono-code">{code}</code>;
          }
          if (tagName === 'a') {
            const href = props.href ?? '';
            if (isFileLink(href)) {
              const resolvedHref = toFileUrl(href);
              const name = fileNameFromHref(href);
              return (
                <span class="inline-flex items-center gap-0.5 rounded border bg-muted/50 text-[0.85em] font-medium">
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 text-primary hover:bg-muted cursor-pointer rounded-l"
                    onclick={(e: MouseEvent) => {
                      e.preventDefault();
                      handleFileClick(resolvedHref, name);
                    }}
                  >
                    <FileText class="h-3.5 w-3.5" />
                    {children}
                  </button>
                  <a
                    href={toDownloadUrl(resolvedHref)}
                    download={name}
                    class="inline-flex items-center px-1 py-0.5 text-muted-foreground hover:bg-muted cursor-pointer rounded-r border-l"
                    onclick={(e: MouseEvent) => e.stopPropagation()}
                  >
                    <Download class="h-3 w-3" />
                  </a>
                </span>
              );
            }
            return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
          }
          if (tagName === 'img') {
            const src = props.src ?? '';
            const alt = props.alt ?? '';
            return <CachedMarkdownImg src={src} alt={alt} openLightbox={openLightbox} />;
          }
          if (tagName === 'table') {
            return (
              <div class="not-prose my-4 overflow-x-auto">
                <table class="w-full border-collapse text-[13px]" {...props}>{children}</table>
              </div>
            );
          }
          if (tagName === 'thead') {
            return <thead {...props}>{children}</thead>;
          }
          if (tagName === 'th') {
            return <th class="border border-border bg-muted px-3 py-1.5 text-left text-[13px] font-semibold" {...props}>{children}</th>;
          }
          if (tagName === 'td') {
            return <td class="border border-border px-3 py-1.5" {...props}>{children}</td>;
          }
          if (tagName === 'tr') {
            return <tr class="even:bg-muted/30" {...props}>{children}</tr>;
          }
          if (tagName === 'tbody') {
            return <tbody {...props}>{children}</tbody>;
          }
          if (tagName === 'blockquote') {
            return (
              <blockquote class="my-4 border-l-4 border-muted-foreground rounded-r-md bg-muted px-4 py-3 text-muted-foreground not-italic" {...props}>
                {children}
              </blockquote>
            );
          }
          if (tagName === 'hr') {
            return <hr class="my-6 border-none h-0.5 bg-border" {...props} />;
          }
          if (tagName === 'input' && props.type === 'checkbox') {
            return <input type="checkbox" checked={props.checked} disabled class="mr-1" {...props} />;
          }

          // Default element rendering
          const Component = tagName as any;
          return <Component {...props}>{children}</Component>;
        }
        return null;
      }

      return Array.from(doc.body.childNodes).map(processNode);
    } catch (e) {
      console.error('Render error:', e);
      return <p>Error rendering content</p>;
    }
  });
</script>

<div class={`md-render prose dark:prose-invert max-w-none break-words ${className ?? ''}`}>
  {#if lightboxOpen}
    <ImageLightbox
      src={lightboxSrc}
      alt={lightboxAlt}
      images={galleryImages}
      currentIndex={lightboxCurrentIndex}
      onNavigate={(index: number) => {
        if (galleryImages && galleryImages[index]) {
          lightboxSrc = galleryImages[index].src;
          lightboxAlt = galleryImages[index].alt ?? '';
          lightboxCurrentIndex = index;
        }
      }}
      onClose={() => { lightboxOpen = false; }}
    />
  {/if}

  {@render renderedContent}

  {#if fileLoading}
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/50">
      <div class="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
    </div>
  {/if}

  <Dialog open={filePreviewOpen} onOpenChange={(open) => { if (!open) filePreviewOpen = false; }}>
    {#if filePreviewOpen}
      <DialogContent class="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader class="flex-row items-center gap-2 pr-10">
          <DialogTitle class="truncate text-base flex-1">{filePreviewName}</DialogTitle>
          <a
            href={toDownloadUrl(filePreviewHref)}
            download={filePreviewName}
            class="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <Download class="h-3.5 w-3.5" />
            Download
          </a>
        </DialogHeader>
        <div class="min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/20 p-4">
          {#if filePreviewMediaType === 'image'}
            <img src={filePreviewHref} alt={filePreviewName} class="max-w-full rounded" />
          {:else if filePreviewMediaType === 'audio'}
            <audio controls src={filePreviewHref} class="w-full" />
          {:else if filePreviewMediaType === 'video'}
            <video controls src={filePreviewHref} class="max-w-full rounded" />
          {:else if isMarkdownExt(filePreviewName)}
            <MarkdownRenderer content={filePreviewContent} />
          {:else}
            <pre class="whitespace-pre-wrap text-xs font-mono"><code>{filePreviewContent}</code></pre>
          {/if}
        </div>
      </DialogContent>
    {/if}
  </Dialog>
</div>
