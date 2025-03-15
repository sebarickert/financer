'use server';

import { Theme } from '@/api/ssr-financer-api';
import { updateTheme } from '@/api-service';
export const handleUpdateUserTheme = async (theme: Theme): Promise<void> => {
  try {
    await updateTheme(theme);
  } catch (error) {
    console.error('Error updating user theme:', error);
  }
};
