const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface RequestConfig extends RequestInit {
	params?: Record<string, string | number | boolean>;
}

export async function apiRequest<T>(
	endpoint: string,
	config: RequestConfig = {}
): Promise<T> {
	const { params, ...fetchConfig } = config;

	// Построение URL с параметрами
	const url = new URL(`${API_BASE_URL}${endpoint}`);
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			url.searchParams.append(key, String(value));
		});
	}

	// Получение токена из localStorage
	const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

	// Заголовки по умолчанию
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...fetchConfig.headers,
	};

	try {
		const response = await fetch(url.toString(), {
			...fetchConfig,
			headers,
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || `HTTP error! status: ${response.status}`);
		}

		return data;
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
}

export const api = {
	// Auth endpoints
	auth: {
		login: (email: string, password: string) =>
			apiRequest<{ token: string; user: any }>('/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			}),
		register: (name: string, email: string, password: string) =>
			apiRequest<{ token: string; user: any }>('/auth/register', {
				method: 'POST',
				body: JSON.stringify({ name, email, password }),
			}),
		logout: () => apiRequest<void>('/auth/logout', { method: 'POST' }),
		me: () => apiRequest<any>('/auth/me'),
	},

	// Пример других endpoints
	users: {
		getAll: (params?: { page?: number; limit?: number }) =>
			apiRequest<any[]>('/users', { params }),
		getById: (id: string) => apiRequest<any>(`/users/${id}`),
		create: (data: any) =>
			apiRequest<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
		update: (id: string, data: any) =>
			apiRequest<any>(`/users/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
			}),
		delete: (id: string) =>
			apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),
	},
};
