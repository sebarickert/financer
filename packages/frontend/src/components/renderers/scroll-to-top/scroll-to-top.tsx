import { useEffect } from 'react';

import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';

export const ScrollToTop = () => {
  const { pathname } = useViewTransitionRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
