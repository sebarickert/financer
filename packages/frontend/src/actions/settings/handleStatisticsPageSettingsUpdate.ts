import { RedirectType, redirect } from 'next/navigation';

import { AccountType } from '@/api/ssr-financer-api';
import { settingsPaths } from '@/constants/settingsPaths';
import { DefaultFormActionHandler } from '@/hooks/useFinancerFormState';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';

export const handleStatisticsPageSettingsUpdate: DefaultFormActionHandler =
  async (prev, formData) => {
    'use server';

    await UserPreferenceService.updateStatisticsSettings({
      accountTypes: formData.getAll('accountTypes') as AccountType[],
    });

    redirect(settingsPaths.default, RedirectType.push);
  };
