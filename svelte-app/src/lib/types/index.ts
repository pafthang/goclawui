export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role?: 'admin' | 'user' | 'guest';
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface ApiResponse<T> {
	data?: T;
	error?: string;
	message?: string;
	status: number;
}

export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
