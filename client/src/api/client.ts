import type { PaginatedResponse, Poem, PoemListParams, SearchParams, Author, Stats } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const message = `请求失败: ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export const apiClient = {
  getPoems(params?: PoemListParams): Promise<PaginatedResponse<Poem>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params?.dynasty) searchParams.set('dynasty', params.dynasty);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.author) searchParams.set('author', params.author);
    const query = searchParams.toString();
    return request<PaginatedResponse<Poem>>(`/poems${query ? `?${query}` : ''}`);
  },

  getRandomPoem(): Promise<Poem> {
    return request<Poem>('/poems/random');
  },

  getFeaturedPoems(): Promise<Poem[]> {
    return request<Poem[]>('/poems/featured');
  },

  getPoemById(id: string): Promise<Poem> {
    return request<Poem>(`/poems/${encodeURIComponent(id)}`);
  },

  search(params: SearchParams): Promise<PaginatedResponse<Poem>> {
    const searchParams = new URLSearchParams();
    searchParams.set('q', params.q);
    if (params.type) searchParams.set('type', params.type);
    return request<PaginatedResponse<Poem>>(`/search?${searchParams.toString()}`);
  },

  getAuthors(params?: { page?: number; pageSize?: number }): Promise<PaginatedResponse<Author>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    const query = searchParams.toString();
    return request<PaginatedResponse<Author>>(`/authors${query ? `?${query}` : ''}`);
  },

  getAuthorById(id: string): Promise<Author & { poems: Poem[] }> {
    return request<Author & { poems: Poem[] }>(`/authors/${encodeURIComponent(id)}`);
  },

  getDynasties(): Promise<string[]> {
    return request<string[]>('/dynasties');
  },

  getStats(): Promise<Stats> {
    return request<Stats>('/stats');
  },
};

export { ApiError };
