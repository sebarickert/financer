'use client';

import { usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

import { transitionHelper } from '$utils/transitionHelper';

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  useEffect(() => {
    const listener = (e: PopStateEvent) => {
      const isNavigateBack =
        pathname?.startsWith(e.state.as) && e.state.as !== pathname;

      transitionHelper({
        updateDOM: () => {},
        classNames: isNavigateBack ? 'close-to-right' : undefined,
      });
    };

    window.addEventListener('popstate', listener);

    return () => {
      window.removeEventListener('popstate', listener);
    };
  }, [pathname]);

  return children;
};
