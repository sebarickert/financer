'use client';

import { Button } from '$elements/button/button';
import { clearAllCaches } from '$ssr/api/clear-cache';

export const HardRefreshButton = () => {
  return (
    <Button onClick={() => clearAllCaches()} accentColor="plain">
      Refresh
    </Button>
  );
};
