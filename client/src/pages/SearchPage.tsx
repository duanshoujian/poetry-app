import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from '../hooks/useDebounce';
import SearchBar from '../components/Search/SearchBar';
import SearchResult from '../components/Search/SearchResult';
import Skeleton from '../components/Common/Skeleton';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading, isError, refetch } = useSearch({
    q: debouncedQuery,
  });

  const hasSearched = debouncedQuery.length > 0;

  return (
    <div className="flex-1">
      <div className="max-w-[800px] mx-auto px-8 pb-20">
        {/* Search Bar Area */}
        <div className="py-10">
          <SearchBar
            initialValue={initialQuery}
            onSearch={(value) => setQuery(value)}
          />
        </div>

        {/* Search Info */}
        {hasSearched && !isLoading && data && (
          <div className="text-[15px] text-[var(--color-text-secondary)] mb-6 px-5 py-4 bg-white rounded-xl border border-[var(--color-border-light)]">
            搜索 <strong className="text-[var(--color-accent)] font-semibold">"{debouncedQuery}"</strong> 共找到{' '}
            <strong className="text-[var(--color-text-primary)] font-semibold">{data.pagination.total}</strong> 首诗词
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-1" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <ErrorMessage
            message="搜索失败，请稍后重试"
            onRetry={() => refetch()}
          />
        )}

        {/* Results */}
        {hasSearched && !isLoading && data && data.data.length > 0 && (
          <div className="flex flex-col">
            {data.data.map((poem) => (
              <SearchResult key={poem.id} poem={poem} keyword={debouncedQuery} />
            ))}
          </div>
        )}

        {/* Empty */}
        {hasSearched && !isLoading && data && data.data.length === 0 && (
          <EmptyState
            title={`未找到包含「${debouncedQuery}」的诗词`}
            description="试试其他关键词"
            icon={
              <svg
                className="w-20 h-20"
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="35" cy="35" r="18" />
                <line x1="48" y1="48" x2="68" y2="68" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="28" y1="35" x2="42" y2="35" strokeWidth="2" strokeLinecap="round" />
                <line x1="35" y1="28" x2="35" y2="42" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        )}

        {/* Initial state - no search yet */}
        {!hasSearched && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              className="w-20 h-20 mb-6 text-[var(--color-text-tertiary)] opacity-40"
              viewBox="0 0 80 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="35" cy="35" r="18" />
              <line x1="48" y1="48" x2="68" y2="68" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <h3 className="font-serif text-lg font-medium text-[var(--color-text-secondary)] mb-2">
              搜索诗词
            </h3>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              输入关键词搜索诗词、作者或内容
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
