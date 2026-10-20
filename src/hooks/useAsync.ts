import { useEffect, useRef, useState } from 'react';
import { NotFoundError } from '@/services/http';

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string; notFound: boolean }
  | { status: 'success'; data: T };

/** Runs an async loader whenever `deps` change. Call `reload()` to retry. */
export function useAsync<T>(loader: () => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });
    loaderRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setState({
          status: 'error',
          message: e instanceof Error ? e.message : 'Something went wrong.',
          notFound: e instanceof NotFoundError,
        });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { state, reload: () => setNonce((n) => n + 1) };
}
