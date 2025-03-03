import { isServerSide } from '@/utils/isServerSide';

export const getSessionId = async (): Promise<string | undefined> => {
  if (!isServerSide()) return undefined;

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return cookieStore.get('connect.sid')?.value;
};
