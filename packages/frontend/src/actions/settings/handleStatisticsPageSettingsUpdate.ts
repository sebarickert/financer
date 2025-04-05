import { RedirectType, redirect } from 'next/navigation';

import { AccountType } from '@/api/ssr-financer-api';
import { updateStatisticsSettings } from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';

export const handleStatisticsPageSettingsUpdate: DefaultFormActionHandler =
  async (prev, formData) => {
    'use server';

    await updateStatisticsSettings({
      accountTypes: formData.getAll('accountTypes') as AccountType[],
    });

    redirect(settingsPaths.default, RedirectType.push);
  };
