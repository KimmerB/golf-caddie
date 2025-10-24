import { clsx } from 'clsx';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx('animate-pulse rounded-full bg-slate-200/80', className)} />
);
