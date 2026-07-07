interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title = '暂无内容',
  description = '这里还没有内容',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
      {icon ? (
        <div className="mb-6 text-[var(--color-text-tertiary)] opacity-50">
          {icon}
        </div>
      ) : (
        <svg
          className="w-20 h-20 mb-6 text-[var(--color-text-tertiary)] opacity-50"
          viewBox="0 0 80 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="35" cy="35" r="18" />
          <line x1="48" y1="48" x2="68" y2="68" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )}
      <h3 className="text-lg font-medium text-[var(--color-text-secondary)] font-serif mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-tertiary)]">{description}</p>
    </div>
  );
}
