import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { SearchParams } from '../types';

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => apiClient.search(params),
    enabled: params.q.length > 0,
  });
}
