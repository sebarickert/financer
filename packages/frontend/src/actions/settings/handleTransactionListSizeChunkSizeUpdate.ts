import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const handleTransactionListSizeChunkSizeUpdate: DefaultFormActionHandler =
  async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateTransactionListChunkSize(
      parseInt(formData.get('chunkSize') as string),
    );

    redirect(settingsPaths.userPreferences, RedirectType.push);
  };
