import Skeleton from '../Common/Skeleton';

export default function PoemSkeleton() {
  return (
    <div className="bg-[var(--color-bg-card)] border border-transparent rounded-xl p-7 pb-6 flex flex-col min-h-[180px]">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full mt-auto" />
      <Skeleton className="h-4 w-5/6 mt-2" />
    </div>
  );
}
