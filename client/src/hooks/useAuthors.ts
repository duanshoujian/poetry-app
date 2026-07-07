import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export function useAuthors(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => apiClient.getAuthors(params),
  });
}

export function useAuthorDetail(id: string) {
  return useQuery({
    queryKey: ['authors', 'detail', id],
    queryFn: () => apiClient.getAuthorById(id),
    enabled: !!id,
  });
}
