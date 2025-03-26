'use server';

import { cookies } from 'next/headers';

import { isServerSide } from '@/utils/isServerSide';

export const getSessionId = async (): Promise<string | undefined> => {
  if (!isServerSide()) return undefined;

  const cookieStore = await cookies();

  return cookieStore.get('connect.sid')?.value;
};
