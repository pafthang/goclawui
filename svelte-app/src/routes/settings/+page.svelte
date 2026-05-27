<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<div class="settings">
	<h1>{$t('navigation.settings')}</h1>
	
	<div class="settings-sections">
		<section class="section">
			<h2>Профиль</h2>
			<p>Настройки вашего профиля</p>
		</section>
		
		<section class="section">
			<h2>Безопасность</h2>
			<p>Пароль и двухфакторная аутентификация</p>
		</section>
		
		<section class="section">
			<h2>Уведомления</h2>
			<p>Настройка уведомлений</p>
		</section>
		
		<section class="section">
			<h2>Интеграции</h2>
			<p>Подключенные сервисы</p>
		</section>
	</div>
</div>

<style>
	.settings {
		padding: 1rem;
	}

	h1 {
		margin-bottom: 2rem;
		color: #1a1a2e;
	}

	.settings-sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.section {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.section h2 {
		margin: 0 0 0.5rem 0;
		color: #1a1a2e;
	}

	.section p {
		margin: 0;
		color: #666;
	}
</style>
