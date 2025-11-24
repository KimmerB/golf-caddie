import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  subtle?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', subtle, className, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

    const variants: Record<ButtonVariant, string> = {
      primary: clsx('bg-primary text-white shadow-subtle hover:bg-emerald-600', {
        'bg-primary/10 text-primary shadow-none hover:bg-primary/15': subtle
      }),
      ghost: 'border border-slate-200 bg-white text-charcoal hover:border-primary hover:text-primary'
    };

    return (
      <button ref={ref} className={clsx(base, variants[variant], className)} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
