import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import type { PoemListParams } from '../types';

export function usePoems(params?: PoemListParams) {
  return useQuery({
    queryKey: ['poems', params],
    queryFn: () => apiClient.getPoems(params),
  });
}

export function useRandomPoem() {
  return useQuery({
    queryKey: ['poems', 'random'],
    queryFn: () => apiClient.getRandomPoem(),
  });
}

export function useFeaturedPoems() {
  return useQuery({
    queryKey: ['poems', 'featured'],
    queryFn: () => apiClient.getFeaturedPoems(),
  });
}

export function usePoemDetail(id: string) {
  return useQuery({
    queryKey: ['poems', 'detail', id],
    queryFn: () => apiClient.getPoemById(id),
    enabled: !!id,
  });
}

export function useDynasties() {
  return useQuery({
    queryKey: ['dynasties'],
    queryFn: () => apiClient.getDynasties(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => apiClient.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}
