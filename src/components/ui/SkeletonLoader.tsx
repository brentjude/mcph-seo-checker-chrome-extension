export function SkeletonLoader() {
  const block = 'rounded-2xl bg-surface-light dark:bg-surface-darkBase';

  return (
    <div className="animate-pulse space-y-4 p-4" aria-label="Scanning page" role="status">
      <div className={`mx-auto h-40 w-40 rounded-full bg-surface-light dark:bg-surface-darkBase`} />
      <div className="mx-auto h-4 w-32 rounded bg-surface-light dark:bg-surface-darkBase" />
      <div className="grid grid-cols-3 gap-3">
        <div className={`h-16 ${block}`} />
        <div className={`h-16 ${block}`} />
        <div className={`h-16 ${block}`} />
      </div>
      <div className={`h-36 ${block}`} />
      <div className={`h-24 ${block}`} />
    </div>
  );
}
