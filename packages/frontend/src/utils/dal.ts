import 'server-only';

import { cache } from 'react';

import { getAuthenticationStatus } from '@/api-service';

export const verifySession = cache(async () => {
  const authenticationStatus = await getAuthenticationStatus();

  if (!authenticationStatus?.authenticated) {
    return false;
  }

  return true;
});
