import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dices } from 'lucide-react';
import { useFeaturedPoems, useRandomPoem } from '../hooks/usePoems';
import PoemCard from '../components/Poem/PoemCard';
import PoemSkeleton from '../components/Poem/PoemSkeleton';
import ErrorMessage from '../components/Common/ErrorMessage';

const TYPE_TAGS = ['全部', '唐诗', '宋词', '元曲', '诗经', '楚辞', '五代词'];

export default function HomePage() {
  const [activeTag, setActiveTag] = useState('全部');
  const { data: featuredPoems, isLoading: featuredLoading, isError: featuredError, refetch: refetchFeatured } = useFeaturedPoems();
  const { data: randomPoem, isLoading: randomLoading, refetch: refetchRandom } = useRandomPoem();

  const handleRandom = () => {
    refetchRandom();
  };

  const heroVerse = randomPoem?.content?.split('\n')[0] || '';
  const highlightedVerse = heroVerse ? highlightRandomChars(heroVerse) : '';

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center max-w-[800px] mx-auto">
        {randomLoading ? (
          <div className="space-y-6">
            <div className="animate-shimmer h-16 w-3/4 mx-auto rounded-lg" />
            <div className="animate-shimmer h-5 w-1/3 mx-auto rounded" />
          </div>
        ) : randomPoem ? (
          <>
            <p className="font-serif text-5xl font-bold text-[var(--color-text-primary)] leading-[1.4] tracking-[0.04em] mb-5">
              {highlightedVerse}
            </p>
            <div className="flex items-center justify-center gap-3 text-base text-[var(--color-text-secondary)] font-sans font-light">
              <Link
                to={randomPoem.authorId ? `/author/${encodeURIComponent(randomPoem.authorId)}` : '#'}
                className="text-[var(--color-text-primary)] font-medium no-underline hover:text-[var(--color-accent)] transition-colors"
              >
                {typeof randomPoem.author === 'string' ? randomPoem.author : randomPoem.author?.name}
              </Link>
              <span className="w-[3px] h-[3px] rounded-full bg-[var(--color-border)]" />
              <Link
                to={`/poem/${encodeURIComponent(randomPoem.title || randomPoem.id)}`}
                className="font-serif italic text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-accent)] transition-colors"
              >
                {randomPoem.title}
              </Link>
              <span className="w-[3px] h-[3px] rounded-full bg-[var(--color-border)]" />
              <span>{randomPoem.dynasty}</span>
            </div>
          </>
        ) : (
          <p className="font-serif text-3xl text-[var(--color-text-tertiary)]">
            加载每日诗词中...
          </p>
        )}
        <div className="w-10 h-px bg-[var(--color-border)] mx-auto mt-12" />
      </section>

      {/* Category Tags */}
      <section className="px-8 pb-12">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-2.5 flex-wrap">
          {TYPE_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`inline-flex items-center px-[22px] py-2 rounded-[100px] text-sm font-normal cursor-pointer transition-all duration-[250ms] ease-in-out select-none font-sans border ${
                activeTag === tag
                  ? 'text-white bg-[var(--color-accent)] border-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] border-transparent hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[rgba(220,38,38,0.04)]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-8 pb-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-[28px] font-bold text-[var(--color-text-primary)] tracking-[0.02em]">
              精选推荐
            </h2>
            <button
              onClick={handleRandom}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[100px] text-sm font-medium text-[var(--color-accent)] bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.15)] cursor-pointer transition-all duration-[250ms] ease-in-out font-sans hover:bg-[rgba(220,38,38,0.12)] hover:border-[var(--color-accent)]"
            >
              <Dices size={16} />
              随机一首
            </button>
          </div>

          {featuredError && (
            <ErrorMessage
              message="加载精选推荐失败"
              onRetry={() => refetchFeatured()}
            />
          )}

          {featuredLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <PoemSkeleton key={i} />
              ))}
            </div>
          )}

          {featuredPoems && featuredPoems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {featuredPoems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          )}

          {featuredPoems && featuredPoems.length === 0 && (
            <div className="text-center py-16 text-[var(--color-text-tertiary)]">
              <p className="font-serif text-lg mb-2">暂无精选推荐</p>
              <p className="text-sm">敬请期待更多精彩诗词</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function highlightRandomChars(verse: string): React.ReactNode {
  if (!verse) return verse;

  const chars = verse.split('').filter((c) => c.trim());
  if (chars.length === 0) return verse;

  const highlightCount = Math.min(2, chars.length);
  const indices = new Set<number>();
  while (indices.size < highlightCount) {
    indices.add(Math.floor(Math.random() * chars.length));
  }

  const result: React.ReactNode[] = [];
  let charIndex = 0;
  for (let i = 0; i < verse.length; i++) {
    const char = verse[i];
    if (char.trim()) {
      if (indices.has(charIndex)) {
        result.push(
          <span key={i} className="text-[var(--color-accent)] relative inline-block">
            {char}
            <span className="absolute bottom-1 left-0 right-0 h-0.5 bg-[var(--color-accent)] opacity-20" />
          </span>
        );
      } else {
        result.push(char);
      }
      charIndex++;
    } else {
      result.push(char);
    }
  }
  return result;
}
