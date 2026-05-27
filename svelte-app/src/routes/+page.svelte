<script lang="ts">
	import { i18nStore } from '$lib/stores/i18n.store';
	import { setupI18n, t } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let currentLocale = $state('en');

	// Подписка на изменения локали
	const unsubscribe = i18nStore.subscribe((state) => {
		currentLocale = state.locale;
	});

	// Инициализация i18n при монтировании
	setupI18n();
</script>

<main>
	<div class="container">
		<header>
			<h1>{$t('navigation.home')}</h1>
			<LanguageSwitcher />
		</header>

		<section>
			<p>{$t('common.welcome')}</p>
		</section>
	</div>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		width: 100%;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 2rem;
		color: #333;
	}

	section {
		background: #f5f5f5;
		padding: 2rem;
		border-radius: 8px;
	}
</style>
