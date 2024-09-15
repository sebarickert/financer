import { redirect, RedirectType } from 'next/navigation';
import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { AccountService } from '$ssr/api/account.service';
import { UserPreferenceService } from '$ssr/api/user-preference.service';
import { UserDefaultAccountSettings } from '$views/settings/user-preferences/preferences/user-default-account-settings';

export const DefaultAccountSettingsContainer: FC = async () => {
  const { data: accounts } = await AccountService.getAll();

  const defaultIncomeAccount =
    await UserPreferenceService.getDefaultIncomeAccount();
  const defaultExpenseAccount =
    await UserPreferenceService.getDefaultExpenseAccount();
  const defaultTransferSourceAccount =
    await UserPreferenceService.getDefaultTransferSourceAccount();
  const defaultTransferTargetAccount =
    await UserPreferenceService.getDefaultTransferTargetAccount();

  const handleSave: DefaultFormActionHandler = async (prev, formData) => {
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

  return (
    <UserDefaultAccountSettings
      accounts={accounts}
      defaultIncomeAccount={defaultIncomeAccount}
      defaultExpenseAccount={defaultExpenseAccount}
      defaultTransferSourceAccount={defaultTransferSourceAccount}
      defaultTransferTargetAccount={defaultTransferTargetAccount}
      onSave={handleSave}
    />
  );
};
