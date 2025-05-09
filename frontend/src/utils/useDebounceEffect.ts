import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(fn: () => void, waitTime: number, deps: DependencyList) {
  useEffect(() => {
    const handler = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
