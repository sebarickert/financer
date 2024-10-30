import { redirect, RedirectType } from 'next/navigation';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UserPreferenceService } from '$ssr/api/user-preference.service';

export const handleAccountSettingsUpdate: DefaultFormActionHandler = async (
  prev,
  formData,
) => {
  'use server';

  await Promise.all([
    UserPreferenceService.updateDefaultIncomeAccount(
      formData.get('toAccountIncome') as string,
    ),
    UserPreferenceService.updateDefaultExpenseAccount(
      formData.get('fromAccountExpense') as string,
    ),
    UserPreferenceService.updateDefaultTransferSourceAccount(
      formData.get('fromAccountTransfer') as string,
    ),
    UserPreferenceService.updateDefaultTransferTargetAccount(
      formData.get('toAccountTransfer') as string,
    ),
  ]);

  redirect(settingsPaths.userPreferences, RedirectType.push);
};
