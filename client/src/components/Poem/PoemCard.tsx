import { Link } from 'react-router-dom';
import type { Poem } from '../../types';

interface PoemCardProps {
  poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
  return (
    <Link
      to={`/poem/${encodeURIComponent(poem.title || poem.id)}`}
      className="block bg-[var(--color-bg-card)] border border-transparent rounded-xl p-7 pb-6 cursor-pointer transition-all duration-[250ms] ease-in-out flex flex-col min-h-[180px] relative overflow-hidden no-underline text-inherit group"
    >
      <span className="absolute top-0 left-0 w-full h-[3px] bg-[var(--color-accent)] scale-x-0 origin-left transition-transform duration-[250ms] ease-in-out rounded-b-[2px] group-hover:scale-x-100" />
      <h3 className="font-serif text-xl font-bold text-[var(--color-text-primary)] mb-2 leading-[1.3] tracking-[0.02em] group-hover:text-[var(--color-accent)]">
        {poem.title}
      </h3>
      <div className="text-[13px] text-[var(--color-text-secondary)] mb-4 font-sans font-light">
        <span className="font-medium text-[var(--color-text-primary)]">{typeof poem.author === 'string' ? poem.author : poem.author?.name}</span>
        {' · '}
        {poem.dynasty}
      </div>
      <p className="font-serif text-sm text-[var(--color-text-secondary)] leading-[1.7] mt-auto font-normal">
        {poem.excerpt || poem.content?.slice(0, 50) + (poem.content?.length > 50 ? '...' : '')}
      </p>
    </Link>
  );
}
