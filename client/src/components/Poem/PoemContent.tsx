interface PoemContentProps {
  content: string;
}

export default function PoemContent({ content }: PoemContentProps) {
  const lines = content.split('\n').filter((line) => line.trim());

  return (
    <div className="bg-white border border-[var(--color-border)] rounded-2xl px-14 py-12 mb-6 shadow-[0_1px_2px_rgba(28,25,23,0.04)] relative overflow-hidden">
      <span className="absolute top-0 left-0 w-full h-[3px] bg-[var(--color-accent)] opacity-60" />
      <div className="font-serif text-[22px] font-medium text-[var(--color-text-primary)] leading-[2] tracking-[0.1em] text-center">
        {lines.map((line, i) => (
          <p key={i} className="mb-0">
            {line.split('').join(' ')}
          </p>
        ))}
      </div>
    </div>
  );
}
