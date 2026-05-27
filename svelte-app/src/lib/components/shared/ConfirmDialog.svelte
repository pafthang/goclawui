<script lang="ts">
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmLabel?: string;
    variant?: 'default' | 'destructive';
    onConfirm: () => void;
    loading?: boolean;
  }

  let {
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    variant = 'default',
    onConfirm,
    loading
  }: Props = $props();
</script>

<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onclick={() => onOpenChange(false)} disabled={loading}>
        Cancel
      </Button>
      <Button variant={variant} onclick={onConfirm} disabled={loading}>
        {loading ? '...' : (confirmLabel ?? 'Confirm')}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
