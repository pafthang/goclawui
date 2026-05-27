<script lang="ts">
  import { Combobox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '$lib/components/ui';
  import { Button, Input, InfoLabel } from '$lib/components/shared';
  import { t } from '$lib/i18n/translations';
  import type { Provider, Model } from '$lib/types';

  interface Props {
    provider: string;
    onProviderChange: (v: string) => void;
    model: string;
    onModelChange: (v: string) => void;
    providerTip?: string;
    modelTip?: string;
    providerLabel?: string;
    modelLabel?: string;
    providerPlaceholder?: string;
    modelPlaceholder?: string;
    showVerify?: boolean;
    savedProvider?: string;
    savedModel?: string;
    onSaveBlockedChange?: (blocked: boolean) => void;
    allowEmpty?: boolean;
    filterEmbedding?: boolean;
    modelFilter?: string;
    extraModels?: { id: string; name: string }[];
    providers?: Provider[];
    models?: Model[];
    modelsLoading?: boolean;
    verifying?: boolean;
    verifyResult?: { valid: boolean; error?: string } | null;
    onVerify?: () => Promise<void>;
  }

  let {
    provider,
    onProviderChange,
    model,
    onModelChange,
    providerTip,
    modelTip,
    providerLabel,
    modelLabel,
    providerPlaceholder,
    modelPlaceholder,
    showVerify,
    savedProvider,
    savedModel,
    onSaveBlockedChange,
    allowEmpty = false,
    filterEmbedding = false,
    modelFilter,
    extraModels = [],
    providers = [],
    models = [],
    modelsLoading = false,
    verifying = false,
    verifyResult = null,
    onVerify,
  }: Props = $props();

  const enabledProviders = $derived(
    providers.filter((p) => {
      if (!p.enabled) return false;
      if (filterEmbedding) {
        const s = p.settings as Record<string, unknown> | undefined;
        const emb = s?.embedding as { enabled?: boolean } | undefined;
        return emb?.enabled === true;
      }
      return true;
    })
  );

  const hasSavedValues = savedProvider !== undefined && savedModel !== undefined;
  const llmChanged = $derived(hasSavedValues && (provider !== savedProvider || model !== savedModel));
  const shouldShowVerify = $derived(showVerify ?? llmChanged);

  $effect(() => {
    onSaveBlockedChange?.(!!llmChanged && !verifyResult?.valid);
  });

  function handleProviderChange(v: string) {
    onProviderChange(v === '__empty__' ? '' : v);
    if (!allowEmpty) {
      onModelChange('');
    }
  }

  async function handleVerify() {
    if (!provider || !model.trim()) return;
    await onVerify?.();
  }

  const filteredModels = $derived(() => {
    let list = models;
    if (modelFilter) {
      const f = modelFilter.toLowerCase();
      list = models.filter((m) => {
        const id = m.id.toLowerCase();
        const name = (m.name ?? '').toLowerCase();
        return id.includes(f) || name.includes(f);
      });
    }
    // Prepend extra models, dedup by id
    if (extraModels.length) {
      const apiIds = new Set(list.map((m) => m.id));
      const extras = extraModels.filter((m) => !apiIds.has(m.id));
      list = [...extras, ...list];
    }
    return list.map((m) => ({ value: m.id, label: m.name }));
  });
</script>

<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <div class="grid gap-1.5">
    <InfoLabel tip={providerTip ?? t('providerTip')}>{providerLabel ?? t('provider')}</InfoLabel>
    {#if enabledProviders.length > 0}
      <Select value={provider || '__empty__'} onValueChange={handleProviderChange}>
        <SelectTrigger>
          <SelectValue placeholder={providerPlaceholder ?? t('selectProvider')} />
        </SelectTrigger>
        <SelectContent>
          {#if allowEmpty}
            <SelectItem value="__empty__">{providerPlaceholder || '(auto)'}</SelectItem>
          {/if}
          {#each enabledProviders as p (p.name)}
            <SelectItem value={p.name}>
              <span class="flex items-center gap-2">
                {p.display_name || p.name}
              </span>
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
    {:else}
      <Input
        value={provider}
        oninput={(e) => handleProviderChange(e.currentTarget.value)}
        placeholder={t('noProvidersConfigured')}
      />
    {/if}
  </div>
  <div class="grid gap-1.5">
    <InfoLabel tip={modelTip ?? t('modelTip')}>{modelLabel ?? t('model')}</InfoLabel>
    <div class="flex gap-2">
      <div class="flex-1">
        <Combobox
          value={model}
          onChange={onModelChange}
          options={filteredModels()}
          placeholder={modelsLoading ? t('loadingModels') : (modelPlaceholder ?? t('enterOrSelectModel'))}
          allowCustom={true}
          customLabel={t('useCustomModel')}
        />
      </div>
      {#if shouldShowVerify}
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="h-9 shrink-0 px-3"
          disabled={!provider || !model.trim() || verifying}
          onclick={handleVerify}
        >
          {#if verifying}
            ...
          {:else}
            {t('check')}
          {/if}
        </Button>
      {/if}
    </div>
    {#if shouldShowVerify && verifyResult}
      <p class={`text-xs ${verifyResult.valid ? 'text-success' : 'text-destructive'}`}>
        {#if verifyResult.valid}
          {t('modelVerified')}
        {:else}
          {verifyResult.error || t('verificationFailed')}
        {/if}
      </p>
    {/if}
  </div>
</div>

</script>
