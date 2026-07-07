import { Link } from 'react-router-dom';
import type { Poem } from '../../types';

interface SearchResultProps {
  poem: Poem;
  keyword: string;
}

function highlightText(text: string, keyword: string): React.ReactNode {
  if (!keyword || !text) return text;

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-transparent text-[var(--color-accent)] font-semibold px-[1px]">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchResult({ poem, keyword }: SearchResultProps) {
  return (
    <Link
      to={`/poem/${encodeURIComponent(poem.title || poem.id)}`}
      className="block no-underline text-inherit px-6 py-5 rounded-xl transition-all duration-[250ms] ease-in-out mb-[1px] cursor-pointer group relative"
    >
      <h3 className="font-serif text-lg font-semibold text-[var(--color-text-primary)] mb-1 transition-colors duration-[150ms] group-hover:text-[var(--color-accent)]">
        {highlightText(poem.title, keyword)}
      </h3>
      <div className="text-[13px] text-[var(--color-text-secondary)] mb-2.5">
        {typeof poem.author === 'string' ? poem.author : poem.author?.name} · {poem.dynasty}
      </div>
      <div className="font-serif text-sm text-[var(--color-text-secondary)] leading-[1.8] line-clamp-3">
        {highlightText(poem.content || poem.excerpt || '', keyword)}
      </div>
      <span className="block h-px bg-[var(--color-border-light)] mt-5 transition-colors group-hover:bg-transparent" />
    </Link>
  );
}
