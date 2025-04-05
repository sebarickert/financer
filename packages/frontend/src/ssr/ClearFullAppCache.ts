'use server';

// All other revalidate function are exported from "use server" files which enforces those to be exported as async
// functions, so we should do the same here to keep the consistency.

import { revalidateTag } from 'next/cache';

import { API_TAG } from './ApiTags';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateFullAppCache = async (): Promise<void> => {
  revalidateTag(API_TAG.APP);
};
