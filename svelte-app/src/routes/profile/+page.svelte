<script lang="ts">
	import { t } from '$lib/i18n';
	import { authStore, logout, type User } from '$lib/stores/auth.store';

	let user = $state<User | null>(null);

	// Подписка на изменения auth store
	const unsubscribe = authStore.subscribe((state) => {
		user = state.user;
	});

	function handleLogout() {
		logout();
	}
</script>

<div class="profile">
	<h1>{$t('navigation.profile')}</h1>
	
	{#if user}
		<div class="profile-card">
			<div class="avatar">
				{user.avatar ? `<img src={user.avatar} alt={user.name}>` : `<div class="avatar-placeholder">{user.name.charAt(0)}</div>`}
			</div>
			
			<div class="info">
				<h2>{user.name}</h2>
				<p>{user.email}</p>
			</div>
			
			<button onclick={handleLogout} class="logout-btn">
				{$t('auth.logout')}
			</button>
		</div>
	{:else}
		<div class="not-logged-in">
			<p>Вы не авторизованы</p>
			<a href="/login" class="login-link">{$t('auth.login')}</a>
		</div>
	{/if}
</div>

<style>
	.profile {
		padding: 1rem;
	}

	h1 {
		margin-bottom: 2rem;
		color: #1a1a2e;
	}

	.profile-card {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		background: #4ade80;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
	}

	.info {
		flex: 1;
	}

	.info h2 {
		margin: 0 0 0.5rem 0;
		color: #1a1a2e;
	}

	.info p {
		margin: 0;
		color: #666;
	}

	.logout-btn {
		background: #ef4444;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.logout-btn:hover {
		background: #dc2626;
	}

	.not-logged-in {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.login-link {
		display: inline-block;
		margin-top: 1rem;
		color: #4ade80;
		text-decoration: none;
		font-weight: bold;
	}

	.login-link:hover {
		text-decoration: underline;
	}
</style>
