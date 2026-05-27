<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmValue: string;
    confirmLabel?: string;
    onConfirm: () => void;
    loading?: boolean;
  }

  let {
    open,
    onOpenChange,
    title,
    description,
    confirmValue,
    confirmLabel,
    onConfirm,
    loading
  }: Props = $props();

  let inputValue = $state('');

  const normalizeForCompare = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase();
  const confirmationTarget = confirmValue.trim() || confirmValue;

  $effect(() => {
    if (!open) inputValue = '';
  });

  const isMatch = confirmValue
    ? normalizeForCompare(inputValue) === normalizeForCompare(confirmValue)
    : inputValue.trim().length > 0;
</script>

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <div class="py-2">
      <p class="mb-2 text-sm text-muted-foreground">
        Type <span class="font-semibold text-foreground">{confirmationTarget}</span> to confirm
      </p>
      <Input
        value={inputValue}
        oninput={(e: Event) => inputValue = (e.target as HTMLInputElement).value}
        placeholder={confirmationTarget}
        autofocus
      />
    </div>
    <DialogFooter>
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={loading}>
        Cancel
      </Button>
      <Button
        variant="destructive"
        onclick={onConfirm}
        disabled={!isMatch || loading}
      >
        {loading ? '...' : (confirmLabel ?? 'Delete')}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
