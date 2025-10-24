import { PropsWithChildren } from 'react';
import { clsx } from 'clsx';

type CardProps = PropsWithChildren<{ className?: string; surface?: 'default' | 'muted' }>;

export const Card = ({ children, className, surface = 'default' }: CardProps) => (
  <section
    className={clsx(
      'rounded-3xl border border-slate-200 p-6 shadow-subtle transition-shadow hover:shadow-lg',
      surface === 'muted' && 'bg-fog/60',
      className
    )}
  >
    {children}
  </section>
);
