'use server';

import { Theme } from '@/api/ssr-financer-api';
import { UserService } from '@/ssr/api/UserService';

export const handleUpdateUserTheme = async (theme: Theme): Promise<void> => {
  try {
    await UserService.updateTheme(theme);
  } catch (error) {
    console.error('Error updating user theme:', error);
  }
};
