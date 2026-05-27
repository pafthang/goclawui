<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$lib/i18n';

	let error = $derived($page.error);
	let status = $derived($page.status);
</script>

<div class="error-page">
	<div class="error-content">
		<h1>{status}</h1>
		
		{#if status === 404}
			<p>{$t('errors.notFound')}</p>
		{:else if status === 500}
			<p>{$t('errors.serverError')}</p>
		{:else if status === 401}
			<p>{$t('errors.unauthorized')}</p>
		{:else if status === 403}
			<p>{$t('errors.forbidden')}</p>
		{:else}
			<p>{$t('common.error')}</p>
		{/if}
		
		{#if error instanceof Error}
			<pre class="error-message">{error.message}</pre>
		{/if}
		
		<a href="/" class="home-link">{$t('navigation.home')}</a>
	</div>
</div>

<style>
	.error-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		padding: 2rem;
	}

	.error-content {
		text-align: center;
		color: white;
	}

	h1 {
		font-size: 6rem;
		margin: 0 0 1rem 0;
		color: #4ade80;
		line-height: 1;
	}

	p {
		font-size: 1.5rem;
		margin: 0 0 2rem 0;
		opacity: 0.9;
	}

	.error-message {
		background: rgba(255, 255, 255, 0.1);
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 2rem;
		font-family: monospace;
		font-size: 0.875rem;
		overflow-x: auto;
		max-width: 500px;
		margin-left: auto;
		margin-right: auto;
	}

	.home-link {
		display: inline-block;
		background: #4ade80;
		color: #1a1a2e;
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: bold;
		transition: transform 0.2s, background 0.2s;
	}

	.home-link:hover {
		transform: translateY(-2px);
		background: #22c55e;
	}
</style>
