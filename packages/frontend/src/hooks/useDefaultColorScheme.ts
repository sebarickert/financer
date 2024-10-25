import { useMemo } from 'react';

import { Theme } from '$api/generated/financerApi';

export const useDefaultColorScheme = () => {
  return useMemo(() => {
    if (typeof window !== 'undefined') {
      const prefersDarkScheme = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
      const isDarkMode = prefersDarkScheme.matches;

      return isDarkMode ? Theme.Dark : Theme.Light;
    }
  }, []);
};
