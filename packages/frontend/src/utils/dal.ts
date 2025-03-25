import 'server-only';

import { cache } from 'react';

import { AuthenticationService } from '@/ssr/api/AuthenticationService';

export const verifySession = cache(async () => {
  const authenticationStatus = await AuthenticationService.getStatus();

  if (!authenticationStatus?.authenticated) {
    return false;
  }

  return true;
});
