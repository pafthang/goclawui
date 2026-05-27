<script lang="ts">
	import { t } from '$lib/i18n';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);

	async function handleRegister(event: Event) {
		event.preventDefault();
		
		if (password !== confirmPassword) {
			error = 'Пароли не совпадают';
			return;
		}

		isLoading = true;
		error = null;

		try {
			// Здесь будет реальный API вызов
			await new Promise((resolve) => setTimeout(resolve, 1000));
			
			window.location.href = '/login';
		} catch (err) {
			error = 'Ошибка регистрации. Попробуйте снова.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="register-container">
	<div class="register-card">
		<h1>{$t('auth.register')}</h1>
		
		<form onsubmit={handleRegister}>
			{#if error}
				<div class="error">{error}</div>
			{/if}
			
			<div class="form-group">
				<label for="name">Имя</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					placeholder="Ваше имя"
				/>
			</div>
			
			<div class="form-group">
				<label for="email">{$t('auth.email')}</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="your@email.com"
				/>
			</div>
			
			<div class="form-group">
				<label for="password">{$t('auth.password')}</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					placeholder="••••••••"
				/>
			</div>
			
			<div class="form-group">
				<label for="confirmPassword">Подтвердите пароль</label>
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					required
					placeholder="••••••••"
				/>
			</div>
			
			<button type="submit" disabled={isLoading} class="submit-btn">
				{isLoading ? $t('common.loading') : $t('auth.signUp')}
			</button>
		</form>
		
		<div class="footer-links">
			<a href="/login">Уже есть аккаунт? {$t('auth.signIn')}</a>
		</div>
	</div>
</div>

<style>
	.register-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
		padding: 2rem;
	}

	.register-card {
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
