import { PropsWithChildren } from 'react';

export const BottomActionBar = ({ children }: PropsWithChildren) => (
  <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-subtle backdrop-blur sm:px-6">
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">{children}</div>
  </div>
);
