import { useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface FilterPanelProps {
  dynasties: string[];
  selectedDynasty: string;
  selectedType: string;
  selectedAuthor: string;
  onDynastyChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
}

const POEM_TYPES = [
  '五言绝句',
  '七言绝句',
  '五言律诗',
  '七言律诗',
  '乐府诗',
  '宋词',
  '元曲',
];

export default function FilterPanel({
  dynasties,
  selectedDynasty,
  selectedType,
  selectedAuthor,
  onDynastyChange,
  onTypeChange,
  onClearFilters,
}: FilterPanelProps) {
  const [authorSearch, setAuthorSearch] = useState('');

  const activeFilterCount = [selectedDynasty, selectedType, selectedAuthor].filter(
    (v) => v && v !== 'all'
  ).length;

  const handleTagClick = useCallback(
    (value: string, currentValue: string, onChange: (v: string) => void) => {
      if (value === 'all') {
        onChange('all');
      } else {
        onChange(currentValue === value ? 'all' : value);
      }
    },
    []
  );

  return (
    <aside className="w-[220px] flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-128px)] overflow-y-auto">
      {/* Dynasty Filter */}
      <div className="mb-7">
        <div className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.06em] mb-3">
          朝代
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onDynastyChange('all')}
            className={`text-xs font-normal rounded-2xl px-3.5 py-1.5 cursor-pointer transition-all duration-[250ms] ease-in-out font-sans whitespace-nowrap border ${
              selectedDynasty === 'all'
                ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-[var(--color-accent)] font-medium'
                : 'text-[var(--color-text-secondary)] bg-white border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[#FAFAFA]'
            }`}
          >
            全部
          </button>
          {dynasties.map((dynasty) => (
            <button
              key={dynasty}
              onClick={() =>
                handleTagClick(dynasty, selectedDynasty, onDynastyChange)
              }
              className={`text-xs font-normal rounded-2xl px-3.5 py-1.5 cursor-pointer transition-all duration-[250ms] ease-in-out font-sans whitespace-nowrap border ${
                selectedDynasty === dynasty
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] bg-white border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[#FAFAFA]'
              }`}
            >
              {dynasty}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-7">
        <div className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.06em] mb-3">
          类型
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onTypeChange('all')}
            className={`text-xs font-normal rounded-2xl px-3.5 py-1.5 cursor-pointer transition-all duration-[250ms] ease-in-out font-sans whitespace-nowrap border ${
              selectedType === 'all'
                ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-[var(--color-accent)] font-medium'
                : 'text-[var(--color-text-secondary)] bg-white border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[#FAFAFA]'
            }`}
          >
            全部
          </button>
          {POEM_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTagClick(type, selectedType, onTypeChange)}
              className={`text-xs font-normal rounded-2xl px-3.5 py-1.5 cursor-pointer transition-all duration-[250ms] ease-in-out font-sans whitespace-nowrap border ${
                selectedType === type
                  ? 'text-[var(--color-accent)] bg-[var(--color-accent-light)] border-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-secondary)] bg-white border-[var(--color-border)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[#FAFAFA]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Author Filter */}
      <div className="mb-7">
        <div className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-[0.06em] mb-3">
          作者
        </div>
        <input
          type="text"
          value={authorSearch}
          onChange={(e) => setAuthorSearch(e.target.value)}
          placeholder="搜索作者..."
          className="w-full h-[34px] px-3 mb-2.5 border border-[var(--color-border)] rounded-md font-sans text-xs text-[var(--color-text-primary)] outline-none bg-white transition-colors focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-tertiary)]"
        />

        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] cursor-pointer mt-1.5 py-0.5 bg-none border-none font-sans hover:text-[var(--color-accent)] transition-colors"
        >
          <X size={12} />
          清除筛选
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] bg-[var(--color-accent)] text-white text-[10px] font-semibold rounded-full ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
