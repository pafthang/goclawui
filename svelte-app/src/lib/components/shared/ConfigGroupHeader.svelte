<script lang="ts">
  interface Props {
    title: string;
    description: string;
  }

  let { title, description }: Props = $props();
</script>

<div class="space-y-0.5 pt-4 first:pt-0">
  <h4 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
    {title}
  </h4>
  <p class="text-xs text-muted-foreground">{description}</p>
</div>
