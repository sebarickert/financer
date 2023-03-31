import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const ScrollToTop = () => {
  const { pathname } = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
