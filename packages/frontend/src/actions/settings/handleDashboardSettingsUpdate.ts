import { RedirectType, redirect } from 'next/navigation';

import { AccountType } from '@/api/ssr-financer-api';
import {
  updateDashboardSettings,
  updateTransactionListChunkSize,
} from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleDashboardSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  'use server';

  await updateDashboardSettings({
    accountTypes: formData.getAll('accountTypes') as AccountType[],
  });

  await updateTransactionListChunkSize(
    parseInt(formData.get('chunkSize') as string),
  );

  redirect(settingsPaths.default, RedirectType.push);
};
