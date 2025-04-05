'use server';

import { RedirectType, redirect } from 'next/navigation';

import { updateDefaultMarketUpdateSettings } from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleMarketSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  await updateDefaultMarketUpdateSettings({
    transactionDescription: formData.get('transactionDescription') as string,
    category: formData.get('category') as string,
  });

  redirect(settingsPaths.default, RedirectType.push);
};
