import { writable, type Writable } from 'svelte/store';

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	isLoading: true
};

export const authStore: Writable<AuthState> = writable(initialState);

export function setUser(user: User) {
	authStore.update(() => ({
		user,
		isAuthenticated: true,
		isLoading: false
	}));
}

export function logout() {
	authStore.update(() => ({
		user: null,
		isAuthenticated: false,
		isLoading: false
	}));
}

export function setLoading(loading: boolean) {
	authStore.update((state) => ({
		...state,
		isLoading: loading
	}));
}
