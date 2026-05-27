<script lang="ts">
	import { i18nStore, setLocale } from '$lib/stores/i18n.store';

	let currentLocale = $state('en');

	// Подписка на изменения локали
	const unsubscribe = i18nStore.subscribe((state) => {
		currentLocale = state.locale;
	});

	function handleLocaleChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		setLocale(select.value);
	}
</script>

<div class="language-switcher">
	<select value={currentLocale} onchange={handleLocaleChange}>
		{#each ['en', 'ru'] as code}
			<option value={code}>
				{code === 'en' ? '🇬🇧 English' : '🇷🇺 Русский'}
			</option>
		{/each}
	</select>
</div>

<style>
	.language-switcher {
		display: inline-block;
	}

	select {
		padding: 0.5rem;
		border-radius: 4px;
		border: 1px solid #ccc;
		background: white;
		cursor: pointer;
	}
</style>
