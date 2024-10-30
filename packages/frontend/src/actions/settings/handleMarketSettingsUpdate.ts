'use server';

import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const handleMarketSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  await UserPreferenceService.updateDefaultMarketUpdateSettings({
    transactionDescription: formData.get('transactionDescription') as string,
    category: formData.get('category') as string,
  });

  redirect(settingsPaths.userPreferences, RedirectType.push);
};
