import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuthorDetail } from '../hooks/useAuthors';
import PoemCard from '../components/Poem/PoemCard';
import PoemSkeleton from '../components/Poem/PoemSkeleton';
import Skeleton from '../components/Common/Skeleton';
import ErrorMessage from '../components/Common/ErrorMessage';
import EmptyState from '../components/Common/EmptyState';

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: author, isLoading, isError, refetch } = useAuthorDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="max-w-[1000px] mx-auto px-8 pb-20">
          <Skeleton className="h-6 w-20 mt-6" />
          <div className="text-center py-16">
            <Skeleton className="h-14 w-14 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-5 w-48 mx-auto mb-4" />
            <Skeleton className="h-16 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <PoemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1">
        <div className="max-w-[1000px] mx-auto px-8 pb-20">
          <ErrorMessage
            message="加载作者信息失败"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex-1">
        <div className="max-w-[1000px] mx-auto px-8 pb-20 text-center py-20">
          <p className="text-lg text-[var(--color-text-secondary)] font-serif">作者不存在</p>
          <Link
            to="/poems"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-[var(--color-accent)] no-underline hover:underline"
          >
            <ArrowLeft size={16} />
            返回诗词列表
          </Link>
        </div>
      </div>
    );
  }

  const poems = 'poems' in author ? (author as { poems: typeof author.poems }).poems || [] : [];

  return (
    <div className="flex-1">
      <div className="max-w-[1000px] mx-auto px-8 pb-20">
        {/* Back Navigation */}
        <div className="pt-6 pb-2">
          <Link
            to="/poems"
            className="inline-flex items-center gap-1.5 px-3 py-2 pr-3 rounded-lg text-sm text-[var(--color-text-secondary)] no-underline cursor-pointer transition-all duration-[250ms] ease-in-out hover:text-[var(--color-text-primary)] hover:bg-[var(--color-divider)]"
          >
            <ArrowLeft size={18} />
            返回
          </Link>
        </div>

        {/* Author Header */}
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(220,38,38,0.1)] to-[rgba(220,38,38,0.05)] flex items-center justify-center font-serif text-3xl font-bold text-[var(--color-accent)] mx-auto mb-5 select-none">
            {author.name.charAt(0)}
          </div>
          <h1 className="font-serif text-3xl font-bold text-[var(--color-text-primary)] tracking-[0.06em] mb-3">
            {author.name}
          </h1>
          <div className="text-[15px] text-[var(--color-text-secondary)] font-light mb-4">
            {author.dynasty}
            {author.poemCount !== undefined && ` · ${author.poemCount} 首作品`}
          </div>
          {author.description && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8] font-light max-w-[600px] mx-auto">
              {author.description}
            </p>
          )}
        </div>

        {/* Poems List */}
        <h2 className="font-serif text-2xl font-bold text-[var(--color-text-primary)] tracking-[0.02em] mb-6">
          作品列表
        </h2>

        {poems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无作品"
            description="该作者暂无收录作品"
          />
        )}
      </div>
    </div>
  );
}
