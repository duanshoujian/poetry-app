import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (value: string) => void;
}

export default function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState(initialValue);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('poetry-search-history') || '[]');
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToHistory = useCallback((term: string) => {
    if (!term.trim()) return;
    setSearchHistory((prev) => {
      const updated = [term, ...prev.filter((h) => h !== term)].slice(0, 8);
      localStorage.setItem('poetry-search-history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSearch = useCallback(
    (searchValue: string) => {
      const trimmed = searchValue.trim();
      if (!trimmed) return;
      saveToHistory(trimmed);
      setShowHistory(false);
      if (onSearch) {
        onSearch(trimmed);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [saveToHistory, onSearch, navigate]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSearch(value);
      }
    },
    [value, handleSearch]
  );

  const handleClear = useCallback(() => {
    setValue('');
    inputRef.current?.focus();
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('poetry-search-history');
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[520px]">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(true)}
          placeholder="搜索诗词、作者、内容..."
          className="w-full h-[42px] pl-[18px] pr-[48px] border-[1.5px] border-[var(--color-border)] rounded-[21px] bg-white font-sans text-sm text-[var(--color-text-primary)] outline-none transition-all duration-[250ms] ease-in-out placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-accent)] focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-[42px] top-1/2 -translate-y-1/2 w-[22px] h-[22px] border-none bg-[var(--color-border)] rounded-full cursor-pointer flex items-center justify-center text-[var(--color-text-secondary)] text-xs transition-all duration-[150ms] hover:bg-[var(--color-text-tertiary)] hover:text-white"
          >
            <X size={12} />
          </button>
        )}
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)] pointer-events-none" />
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--color-border)] rounded-xl shadow-[0_4px_16px_rgba(28,25,23,0.06)] overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border-light)]">
            <span className="text-xs text-[var(--color-text-tertiary)]">搜索历史</span>
            <button
              onClick={clearHistory}
              className="text-xs text-[var(--color-text-tertiary)] cursor-pointer hover:text-[var(--color-accent)] transition-colors bg-none border-none"
            >
              清除
            </button>
          </div>
          {searchHistory.map((term) => (
            <button
              key={term}
              onClick={() => {
                setValue(term);
                handleSearch(term);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-text-secondary)] cursor-pointer hover:bg-[var(--color-bg-card)] transition-colors border-none bg-none font-sans"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
