import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export type Toast = {
  id: number;
  message: string;
  tone?: 'success' | 'info';
};

type ToastContextValue = {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, push, dismiss }), [dismiss, push, toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="pointer-events-none fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={clsx(
                'pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-subtle backdrop-blur',
                toast.tone === 'success'
                  ? 'border-primary/20 bg-white/90 text-primary'
                  : 'border-slate-200 bg-white/90 text-slate-700'
              )}
            >
              <span>{toast.message}</span>
              <button
                type="button"
                className="text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:text-primary"
                onClick={() => dismiss(toast.id)}
              >
                Close
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
