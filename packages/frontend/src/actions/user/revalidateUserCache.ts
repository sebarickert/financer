'use server';

import { UserService } from '$ssr/api/UserService';

export const revalidateUserCache = async () => {
  UserService.revalidateCache();
};
