'use client';

import { Button } from '$elements/Button1/Button';
import { clearAllCaches } from '$ssr/api/clear-cache';

export const HardRefreshButton = () => {
  return (
    <Button onClick={() => clearAllCaches()} accentColor="secondary">
      Clear app cache
    </Button>
  );
};
