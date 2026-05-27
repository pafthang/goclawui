<script lang="ts">
import { t } from '$lib/i18n';
import { authStore } from '$lib/stores/auth.svelte';
import { Button } from '$lib/components/ui/button';
import { Input } from '$lib/components/ui/input';
import { Label } from '$lib/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '$lib/components/ui/card';

let name = $state('');
let email = $state('');
let password = $state('');
let confirmPassword = $state('');
let isLoading = $state(false);
let error = $state<string | null>(null);

function handleSubmit(e: Event) {
e.preventDefault();

if (password !== confirmPassword) {
error = t('auth.register.passwordMismatch');
return;
}

isLoading = true;
error = null;

setTimeout(() => {
authStore.register(name, email, password);
isLoading = false;
}, 1000);
}
</script>

<div class="flex min-h-screen items-center justify-center p-4">
<Card class="w-full max-w-md">
<CardHeader>
<CardTitle>{t('auth.register.title')}</CardTitle>
<CardDescription>{t('auth.register.subtitle')}</CardDescription>
</CardHeader>
<form onsubmit={handleSubmit}>
<CardContent class="space-y-4">
{#if error}
<div class="text-sm text-destructive">{error}</div>
{/if}
<div class="space-y-2">
<Label for="name">{t('auth.name')}</Label>
<Input
id="name"
type="text"
bind:value={name}
required
/>
</div>
<div class="space-y-2">
<Label for="email">{t('auth.email')}</Label>
<Input
id="email"
type="email"
placeholder="name@example.com"
bind:value={email}
required
/>
</div>
<div class="space-y-2">
<Label for="password">{t('auth.password')}</Label>
<Input
id="password"
type="password"
bind:value={password}
required
/>
</div>
<div class="space-y-2">
<Label for="confirmPassword">{t('auth.confirmPassword')}</Label>
<Input
id="confirmPassword"
type="password"
bind:value={confirmPassword}
required
/>
</div>
</CardContent>
<CardFooter>
<Button type="submit" class="w-full" disabled={isLoading}>
{#if isLoading}
{t('common.loading')}...
{:else}
{t('auth.register.submit')}
{/if}
</Button>
</CardFooter>
</form>
</Card>
</div>
