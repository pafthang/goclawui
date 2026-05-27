<script lang="ts">
	import { t } from '$lib/i18n';
	import { authStore, setUser } from '$lib/stores/auth.svelte';

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function handleLogin(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = null;

		try {
			// Здесь будет реальный API вызов
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			setUser({
				id: '1',
				name: 'Test User',
				email: email
			});
			
			window.location.href = '/dashboard';
		} catch (err) {
			error = t('auth.loginError', 'common');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="login-container">
	<div class="login-card">
		<h1>{t('auth.login', 'common')}</h1>
		
		<form onsubmit={handleLogin}>
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<div class="form-group">
				<label for="email">{t('auth.email', 'common')}</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="your@email.com"
				/>
			</div>
			
			<div class="form-group">
				<label for="password">{t('auth.password', 'common')}</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					placeholder="••••••••"
				/>
			</div>
			
			<button type="submit" disabled={isLoading} class="submit-btn">
				{isLoading ? t('common.loading', 'common') : t('auth.signIn', 'common')}
			</button>
		</form>
		
		<div class="footer-links">
			<a href="/register">{t('auth.signUp', 'common')}</a>
			<a href="/forgot-password">{t('auth.forgotPassword', 'common')}</a>
		</div>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		padding: 2rem;
	}

	.login-card {
		background: white;
		padding: 2.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 2rem 0;
		color: #1a1a2e;
		text-align: center;
		font-size: 2rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-weight: 600;
		color: #333;
	}

	input {
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #4ade80;
	}

	.error {
		background: #fee2e2;
		color: #dc2626;
		padding: 0.75rem;
		border-radius: 6px;
		font-size: 0.875rem;
	}

	.submit-btn {
		background: #4ade80;
		color: white;
		border: none;
		padding: 0.875rem;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		background: #22c55e;
	}

	.submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.footer-links {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		text-align: center;
	}

	.footer-links a {
		color: #4ade80;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.footer-links a:hover {
		text-decoration: underline;
	}
</style>
