import { redirect, RedirectType } from 'next/navigation';

import { AccountType } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const handleDashboardSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  'use server';

  await UserPreferenceService.updateDashboardSettings({
    accountTypes: formData.getAll('accountTypes') as AccountType[],
  });

  await UserPreferenceService.updateTransactionListChunkSize(
    parseInt(formData.get('chunkSize') as string),
  );

  redirect(settingsPaths.userPreferences, RedirectType.push);
};
