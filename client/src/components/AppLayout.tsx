import { PropsWithChildren } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Clubs', to: '/clubs' }
];

export const AppLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white text-charcoal">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-serif text-2xl font-semibold text-primary">
            Verde Club
          </Link>
          <nav className="hidden gap-6 text-sm font-medium sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={clsx('transition hover:text-primary', {
                  'text-primary': location.pathname === item.to
                })}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-80px)] w-full max-w-5xl px-4 pb-20 pt-8 sm:px-6">
        {children}
      </main>
    </div>
  );
};
