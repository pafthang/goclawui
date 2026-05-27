import { writable, type Writable } from 'svelte/store';

export interface Language {
	code: string;
	name: string;
	flag?: string;
}

export interface I18nState {
	locale: string;
	languages: Language[];
	isLoading: boolean;
}

const languages: Language[] = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

const initialState: I18nState = {
	locale: 'en',
	languages,
	isLoading: false
};

export const i18nStore: Writable<I18nState> = writable(initialState);

export function setLocale(locale: string) {
	i18nStore.update((state) => ({
		...state,
		locale
	}));
}

export function setLoading(loading: boolean) {
	i18nStore.update((state) => ({
		...state,
		isLoading: loading
	}));
}
