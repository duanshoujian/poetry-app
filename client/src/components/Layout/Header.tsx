import { Link, useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchValue.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      }
    },
    [navigate, searchValue]
  );

  return (
    <header className="sticky top-0 z-100 bg-[var(--color-bg-primary)]/85 backdrop-blur-[16px] border-b border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-[22px] font-bold text-[var(--color-text-primary)] tracking-[0.02em] no-underline whitespace-nowrap">
          诗词<span className="text-[var(--color-accent)]">鉴赏</span>
        </Link>

        <div className="relative w-full max-w-[400px] mx-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="搜索诗词、作者、名句..."
            className="w-full h-10 pl-10 pr-4 border border-[var(--color-border)] rounded-[20px] bg-[var(--color-bg-primary)] font-sans text-sm text-[var(--color-text-primary)] outline-none transition-all duration-[250ms] ease-in-out placeholder:text-[var(--color-text-secondary)] placeholder:font-light focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
          />
        </div>

        <div className="w-[120px]" />
      </div>
    </header>
  );
}
