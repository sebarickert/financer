'use server';

import { BaseApi } from '$ssr/api/BaseApi';

export const revalidateFullAppCache = async () => {
  BaseApi.revalidateFullAppCache();
};
