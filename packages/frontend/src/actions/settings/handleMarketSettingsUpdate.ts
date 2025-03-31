'use server';

import { RedirectType, redirect } from 'next/navigation';

import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';

export const handleMarketSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  await UserPreferenceService.updateDefaultMarketUpdateSettings({
    transactionDescription: formData.get('transactionDescription') as string,
    category: formData.get('category') as string,
  });

  redirect(settingsPaths.default, RedirectType.push);
};
