import { Link } from 'react-router-dom';
import type { Author } from '../../types';

interface AuthorCardProps {
  author: Author;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const initial = author.name.charAt(0);

  return (
    <Link
      to={`/author/${encodeURIComponent(author.id)}`}
      className="flex items-center gap-5 bg-white border border-[var(--color-border)] rounded-xl p-6 cursor-pointer transition-all duration-[250ms] ease-in-out no-underline text-inherit shadow-[0_1px_2px_rgba(28,25,23,0.04)] hover:border-[var(--color-accent)] hover:shadow-[0_4px_16px_rgba(28,25,23,0.06)] hover:-translate-y-[1px] group"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[rgba(220,38,38,0.1)] to-[rgba(220,38,38,0.05)] flex items-center justify-center font-serif text-2xl font-bold text-[var(--color-accent)] flex-shrink-0 select-none">
        {initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="font-serif text-lg font-bold text-[var(--color-text-primary)] tracking-[0.04em]">
            {author.name}
          </span>
        </div>
        <div className="text-[13px] text-[var(--color-text-tertiary)] mb-1">
          {author.dynasty}
          {author.poemCount !== undefined && ` · ${author.poemCount} 首作品`}
        </div>
        {author.description && (
          <p className="text-sm text-[var(--color-text-secondary)] leading-[1.6] font-light">
            {author.description}
          </p>
        )}
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
  );
}
