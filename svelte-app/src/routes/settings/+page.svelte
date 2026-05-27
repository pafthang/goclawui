<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<div class="settings">
	<h1>{t('navigation.settings', 'common')}</h1>
	
	<div class="settings-sections">
		<section class="section">
			<h2>{t('settings.profile', 'common')}</h2>
			<p>{t('settings.profileDesc', 'common')}</p>
		</section>
		
		<section class="section">
			<h2>{t('settings.security', 'common')}</h2>
			<p>{t('settings.securityDesc', 'common')}</p>
		</section>
		
		<section class="section">
			<h2>{t('settings.notifications', 'common')}</h2>
			<p>{t('settings.notificationsDesc', 'common')}</p>
		</section>
		
		<section class="section">
			<h2>{t('settings.integrations', 'common')}</h2>
			<p>{t('settings.integrationsDesc', 'common')}</p>
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
