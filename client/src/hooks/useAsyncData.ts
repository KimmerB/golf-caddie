import { useEffect, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useAsyncData = <T>(loader: () => Promise<T>, deps: unknown[]) => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setStatus('loading');
    loader()
      .then((value) => {
        if (!mounted) return;
        setData(value);
        setStatus('success');
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        setStatus('error');
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { status, data, error } as const;
};
