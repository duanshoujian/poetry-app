import { useState, useCallback } from 'react';
import { usePoems, useDynasties } from '../hooks/usePoems';
import FilterPanel from '../components/Filter/FilterPanel';
import PoemCard from '../components/Poem/PoemCard';
import PoemSkeleton from '../components/Poem/PoemSkeleton';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';
import type { PoemListParams } from '../types';

export default function PoemListPage() {
  const [params, setParams] = useState<PoemListParams>({
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, isError, refetch } = usePoems(params);
  const { data: dynasties = [] } = useDynasties();

  const selectedDynasty = params.dynasty || 'all';
  const selectedType = params.type || 'all';
  const selectedAuthor = params.author || 'all';

  const handleDynastyChange = useCallback(
    (value: string) => {
      setParams((prev) => ({
        ...prev,
        dynasty: value === 'all' ? undefined : value,
        page: 1,
      }));
    },
    []
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setParams((prev) => ({
        ...prev,
        type: value === 'all' ? undefined : value,
        page: 1,
      }));
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setParams({ page: 1, pageSize: 20 });
  }, []);

  const handleLoadMore = useCallback(() => {
    if (data && params.page && params.page < data.pagination.totalPages) {
      setParams((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  }, [data, params.page]);

  return (
    <div className="flex-1">
      <div className="flex max-w-[1280px] mx-auto px-10 py-8 gap-10 min-h-[calc(100vh-64px)]">
        <FilterPanel
          dynasties={dynasties}
          selectedDynasty={selectedDynasty}
          selectedType={selectedType}
          selectedAuthor={selectedAuthor}
          onDynastyChange={handleDynastyChange}
          onTypeChange={handleTypeChange}
          onClearFilters={handleClearFilters}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border-light)]">
            <span className="text-sm text-[var(--color-text-secondary)] font-normal">
              共 <strong className="text-[var(--color-text-primary)] font-semibold">{data?.pagination.total || 0}</strong> 首
            </span>
          </div>

          {isError && (
            <ErrorMessage
              message="加载诗词列表失败"
              onRetry={() => refetch()}
            />
          )}

          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <PoemSkeleton key={i} />
              ))}
            </div>
          )}

          {data && data.data.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.data.map((poem) => (
                  <PoemCard key={poem.id} poem={poem} />
                ))}
              </div>

              {params.page && params.page < data.pagination.totalPages && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="text-sm font-medium text-[var(--color-text-secondary)] bg-white border-[1.5px] border-[var(--color-border)] rounded-3xl px-9 py-2.5 cursor-pointer transition-all duration-[250ms] ease-in-out font-sans tracking-[0.02em] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[0_2px_8px_rgba(220,38,38,0.08)] active:scale-[0.97]"
                  >
                    加载更多
                  </button>
                </div>
              )}
            </>
          )}

          {data && data.data.length === 0 && (
            <EmptyState
              title="暂无诗词"
              description="试试调整筛选条件"
            />
          )}
        </div>
      </div>
    </div>
  );
}
