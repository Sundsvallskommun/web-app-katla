import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(fn: (...args: unknown[]) => void, waitTime: number, deps?: DependencyList) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn(...(deps || []));
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
