'use server';

import { revalidateTag } from 'next/cache';

import { client } from './ApiClient';
import { API_TAG, getEntityTag } from './ApiTags';
import { revalidateFullAppCache } from './ClearFullAppCache';

import {
  SchemaUserDataImportDto,
  SchemaUserDto,
  Theme,
} from '@/api/ssr-financer-api';
import { ValidationException } from '@/exceptions/validation.exception';
import { isValidationErrorResponse } from '@/utils/apiHelper';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateUserCache = async (id?: string): Promise<void> => {
  if (id) {
    revalidateTag(getEntityTag(API_TAG.USER, id));
    return;
  }

  revalidateTag(API_TAG.USER);
};

const OWN_USER_ID = 'my-user';

export const getOwnUserTheme = async (): Promise<Theme> => {
  try {
    const user = await getOwnUser();
    return user.theme;
  } catch {
    return Theme.AUTO;
  }
};

export const getOwnUser = async (): Promise<SchemaUserDto> => {
  const { data, error } = await client.GET(`/api/users/my-user`, {
    next: {
      tags: [API_TAG.USER, getEntityTag(API_TAG.USER, OWN_USER_ID)],
    },
  });

  if (error) {
    throw new Error('Failed to fetch own user data', error);
  }

  return data;
};

export const DEBUG_overrideOwnUserData = async (
  user: SchemaUserDataImportDto,
): Promise<string | undefined> => {
  const { error, data } = await client.POST(`/api/users/my-user/my-data`, {
    body: user,
  });

  if (error) {
    // TODO ugly hack to handle missing types
    const unknownError = error as unknown;

    if (isValidationErrorResponse(unknownError)) {
      throw new ValidationException(
        'Failed to override user data',
        unknownError.message,
      );
    }

    throw new Error('Failed to override user data', error);
  }

  await revalidateFullAppCache();

  return data.payload;
};

export const updateTheme = async (theme: Theme): Promise<void> => {
  await client.PATCH('/api/users/my-user', {
    body: {
      theme,
    },
  });

  await revalidateUserCache();
};
