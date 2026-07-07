import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message = '加载失败，请稍后重试',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
      <AlertTriangle className="w-12 h-12 text-[var(--color-accent)] mb-4 opacity-60" />
      <h3 className="text-lg font-medium text-[var(--color-text-secondary)] font-serif mb-2">
        出错了
      </h3>
      <p className="text-sm text-[var(--color-text-tertiary)] mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-5 py-2 rounded-[100px] text-sm font-medium text-[var(--color-accent)] bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.15)] cursor-pointer transition-all duration-[250ms] ease-in-out font-sans hover:bg-[rgba(220,38,38,0.12)] hover:border-[var(--color-accent)]"
        >
          重试
        </button>
      )}
    </div>
  );
}
