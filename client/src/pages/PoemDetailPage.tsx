import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Share2 } from 'lucide-react';
import { usePoemDetail } from '../hooks/usePoems';
import PoemContent from '../components/Poem/PoemContent';
import Skeleton from '../components/Common/Skeleton';
import ErrorMessage from '../components/Common/ErrorMessage';

type TabType = 'translation' | 'annotation' | 'appreciation';

function getAuthorName(poem: { author: string | { name: string } }): string {
  return typeof poem.author === 'string' ? poem.author : poem.author?.name || '';
}

export default function PoemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: poem, isLoading, isError, refetch } = usePoemDetail(id || '');
  const [activeTab, setActiveTab] = useState<TabType>('translation');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 2000);
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(
      () => showToast('链接已复制到剪贴板'),
      () => showToast('复制失败，请重试')
    );
  }, [showToast]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    const title = poem ? `${poem.title} - ${getAuthorName(poem)} | 诗词鉴赏` : '诗词鉴赏';
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(
        () => showToast('链接已复制，可粘贴分享给好友'),
        () => showToast('分享失败，请重试')
      );
    }
  }, [poem, showToast]);

  const parseAnnotation = (annotation?: string): { word: string; meaning: string }[] => {
    if (!annotation) return [];
    try {
      return JSON.parse(annotation);
    } catch {
      return annotation.split('\n').filter(Boolean).map((line) => {
        const [word, ...rest] = line.split('：');
        return { word: word || '', meaning: rest.join('：') || '' };
      });
    }
  };

  const parseAppreciation = (appreciation?: string): string[] => {
    if (!appreciation) return [];
    return appreciation.split('\n\n').filter(Boolean);
  };

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="max-w-[800px] mx-auto px-8 pb-20">
          <div className="text-center py-16">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-5 w-64 mx-auto" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-32 w-full rounded-xl mb-8" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1">
        <div className="max-w-[800px] mx-auto px-8 pb-20">
          <ErrorMessage
            message="加载诗词详情失败"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="flex-1">
        <div className="max-w-[800px] mx-auto px-8 pb-20 text-center py-20">
          <p className="text-lg text-[var(--color-text-secondary)] font-serif">诗词不存在</p>
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

  const annotations = parseAnnotation(poem.annotation);
  const appreciationBlocks = parseAppreciation(poem.appreciation);

  return (
    <div className="flex-1">
      <div className="max-w-[800px] mx-auto px-8 pb-20">
        {/* Back Navigation */}
        <div className="pt-6 pb-2">
          <Link
            to="/poems"
            className="inline-flex items-center gap-1.5 px-3 py-2 pr-3 rounded-lg text-sm text-[var(--color-text-secondary)] no-underline cursor-pointer transition-all duration-[250ms] ease-in-out hover:text-[var(--color-text-primary)] hover:bg-[var(--color-divider)]"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            返回
          </Link>
        </div>

        {/* Poem Header */}
        <div className="text-center py-16">
          <h1 className="font-serif text-4xl font-bold text-[var(--color-text-primary)] tracking-[0.06em] mb-4 leading-[1.3]">
            {poem.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-[15px] text-[var(--color-text-secondary)] font-light">
            <Link
              to={poem.authorId ? `/author/${encodeURIComponent(poem.authorId)}` : '#'}
              className="text-[var(--color-text-primary)] font-medium no-underline hover:text-[var(--color-accent)] transition-colors"
            >
              {getAuthorName(poem)}
            </Link>
            <span className="w-[3px] h-[3px] rounded-full bg-[var(--color-border)]" />
            <span>{poem.dynasty}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-[var(--color-border)]" />
            <span className="inline-flex items-center px-3 py-0.5 rounded-[100px] text-xs font-medium text-[var(--color-accent)] bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.12)]">
              {poem.type}
            </span>
          </div>
        </div>

        {/* Poem Content */}
        <PoemContent content={poem.content} />

        {/* Author Card */}
        <Link
          to={poem.authorId ? `/author/${encodeURIComponent(poem.authorId)}` : '#'}
          className="flex items-center gap-5 bg-white border border-[var(--color-border)] rounded-xl p-6 mb-8 cursor-pointer transition-all duration-[250ms] ease-in-out shadow-[0_1px_2px_rgba(28,25,23,0.04)] no-underline text-inherit group"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(220,38,38,0.1)] to-[rgba(220,38,38,0.05)] flex items-center justify-center font-serif text-2xl font-bold text-[var(--color-accent)] flex-shrink-0 select-none">
            {getAuthorName(poem).charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-serif text-lg font-bold text-[var(--color-text-primary)] tracking-[0.04em]">
                {getAuthorName(poem)}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-[1.6] font-light">
              {poem.dynasty}
            </p>
          </div>
          <svg
            className="w-5 h-5 text-[var(--color-text-tertiary)] flex-shrink-0 transition-all duration-[250ms] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>

        {/* Tab Section */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(28,25,23,0.04)]">
          <div className="flex border-b border-[var(--color-divider)]">
            {(['translation', 'annotation', 'appreciation'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 bg-none border-none font-sans text-[15px] font-medium cursor-pointer transition-all duration-[250ms] ease-in-out tracking-[0.04em] relative ${
                  activeTab === tab
                    ? 'text-[var(--color-text-primary)] font-semibold'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(28,25,23,0.02)]'
                }`}
              >
                {tab === 'translation' && '译文'}
                {tab === 'annotation' && '注释'}
                {tab === 'appreciation' && '赏析'}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-t-[2px] bg-[var(--color-accent)]" />
                )}
              </button>
            ))}
          </div>

          <div key={activeTab} className="p-10 animate-fade-slide-in">
            {activeTab === 'translation' && (
              <p className="text-[15px] leading-[2] text-[var(--color-text-secondary)] font-sans font-light">
                {poem.translation || '暂无译文'}
              </p>
            )}

            {activeTab === 'annotation' && (
              annotations.length > 0 ? (
                annotations.map((item, i) => (
                  <div
                    key={i}
                    className={`${i < annotations.length - 1 ? 'mb-5 pb-5 border-b border-[var(--color-divider)]' : ''}`}
                  >
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded font-serif text-base font-semibold text-[var(--color-accent)] bg-[rgba(220,38,38,0.06)] mr-3">
                      {item.word}
                    </span>
                    <span className="inline text-sm text-[var(--color-text-secondary)] font-light">
                      {item.meaning}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[15px] leading-[2] text-[var(--color-text-secondary)] font-sans font-light">
                  暂无注释
                </p>
              )
            )}

            {activeTab === 'appreciation' && (
              appreciationBlocks.length > 0 ? (
                appreciationBlocks.map((block, i) => {
                  const lines = block.split('\n').filter(Boolean);
                  const title = lines[0].replace(/^【(.*)】$/, '$1');
                  const content = lines.slice(1).join('\n') || block;
                  return (
                    <div key={i} className="mb-6 last:mb-0">
                      <h4 className="font-sans text-[15px] font-semibold text-[var(--color-text-primary)] mb-2 tracking-[0.03em]">
                        {title}
                      </h4>
                      <p className="text-sm leading-[1.9] text-[var(--color-text-secondary)] font-light">
                        {content}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-[15px] leading-[2] text-[var(--color-text-secondary)] font-sans font-light">
                  {poem.appreciation || '暂无赏析'}
                </p>
              )
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-[var(--color-divider)]">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-[100px] text-sm font-medium cursor-pointer transition-all duration-[250ms] ease-in-out font-sans border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[rgba(220,38,38,0.04)] hover:shadow-[0_1px_2px_rgba(28,25,23,0.04)]"
          >
            <Copy size={16} />
            复制链接
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-[100px] text-sm font-medium cursor-pointer transition-all duration-[250ms] ease-in-out font-sans border border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[rgba(220,38,38,0.04)] hover:shadow-[0_1px_2px_rgba(28,25,23,0.04)]"
          >
            <Share2 size={16} />
            分享
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-7 py-3 rounded-[100px] bg-[var(--color-text-primary)] text-white text-sm font-sans font-normal z-[1000] whitespace-nowrap animate-fade-slide-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
