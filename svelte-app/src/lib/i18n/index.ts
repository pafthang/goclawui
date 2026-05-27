import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator, locale, t, waitLocale } from 'svelte-i18n';

const defaultLocale = 'en';

export function setupI18n() {
	register('en', () => import('$lib/i18n/locales/en.json'));
	register('ru', () => import('$lib/i18n/locales/ru.json'));

	init({
		fallbackLocale: defaultLocale,
		initialLocale: browser ? getLocaleFromNavigator() : defaultLocale
	});
}

export { locale, t, waitLocale };
