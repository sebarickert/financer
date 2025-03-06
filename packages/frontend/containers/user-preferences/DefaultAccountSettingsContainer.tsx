import { FC } from 'react';

import { handleAccountSettingsUpdate } from '@/actions/settings/handleAccountSettingsUpdate';
import { settingsPaths } from '@/constants/settingsPaths';
import { Layout } from '@/layouts/Layout';
import { AccountService } from '@/ssr/api/AccountService';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserDefaultAccountSettingsForm } from '@/views/user-preferences/UserDefaultAccountSettingsForm';

export const DefaultAccountSettingsContainer: FC = async () => {
  const accounts = await AccountService.getAll();

  const defaultIncomeAccount =
    await UserPreferenceService.getDefaultIncomeAccount();
  const defaultExpenseAccount =
    await UserPreferenceService.getDefaultExpenseAccount();
  const defaultTransferSourceAccount =
    await UserPreferenceService.getDefaultTransferSourceAccount();
  const defaultTransferTargetAccount =
    await UserPreferenceService.getDefaultTransferTargetAccount();

  return (
    <Layout
      title="Default Account Settings"
      backLink={settingsPaths.userPreferences}
    >
      <UserDefaultAccountSettingsForm
        accounts={accounts}
        defaultIncomeAccount={defaultIncomeAccount}
        defaultExpenseAccount={defaultExpenseAccount}
        defaultTransferSourceAccount={defaultTransferSourceAccount}
        defaultTransferTargetAccount={defaultTransferTargetAccount}
        onSave={handleAccountSettingsUpdate}
      />
    </Layout>
  );
};
