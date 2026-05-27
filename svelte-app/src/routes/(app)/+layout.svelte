<script lang="ts">
	import { i18nStore, t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let currentLocale = $state('en');

	// Подписка на изменения локали
	const unsubscribe = i18nStore.subscribe((locale) => {
		currentLocale = locale;
	});
</script>

<div class="layout">
	<header class="header">
		<nav class="nav">
			<a href="/" class="logo">{t('navigation.home', 'common')}</a>
			<div class="nav-links">
				<a href="/dashboard">{t('navigation.dashboard', 'common')}</a>
				<a href="/settings">{t('navigation.settings', 'common')}</a>
				<a href="/profile">{t('navigation.profile', 'common')}</a>
			</div>
			<LanguageSwitcher />
		</nav>
	</header>

	<main class="main">
		{@render children?.()}
	</main>

	<footer class="footer">
		<p>&copy; 2025 Goclaw. All rights reserved.</p>
	</footer>
</div>

<style>
	.layout {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.header {
		background: #1a1a2e;
		color: white;
		padding: 1rem 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.nav {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-links a {
		color: white;
		text-decoration: none;
		transition: color 0.2s;
	}

	.nav-links a:hover {
		color: #4ade80;
	}

	.main {
		flex: 1;
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.footer {
		background: #1a1a2e;
		color: white;
		text-align: center;
		padding: 1rem;
		margin-top: auto;
	}
</style>
