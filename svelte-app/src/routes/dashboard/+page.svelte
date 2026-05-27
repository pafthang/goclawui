<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<div class="dashboard">
	<h1>{$t('navigation.dashboard')}</h1>
	
	<div class="cards">
		<div class="card">
			<h3>Статистика</h3>
			<p>Обзор ключевых показателей</p>
		</div>
		
		<div class="card">
			<h3>Активность</h3>
			<p>Последние действия в системе</p>
		</div>
		
		<div class="card">
			<h3>Уведомления</h3>
			<p>Ваши последние уведомления</p>
		</div>
		
		<div class="card">
			<h3>Задачи</h3>
			<p>Текущие задачи и дедлайны</p>
		</div>
	</div>
</div>

<style>
	.dashboard {
		padding: 1rem;
	}

	h1 {
		margin-bottom: 2rem;
		color: #1a1a2e;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.card h3 {
		margin: 0 0 0.5rem 0;
		color: #1a1a2e;
	}

	.card p {
		margin: 0;
		color: #666;
	}
</style>
