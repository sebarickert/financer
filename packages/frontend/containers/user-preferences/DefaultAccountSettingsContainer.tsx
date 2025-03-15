import { FC } from 'react';

import { handleAccountSettingsUpdate } from '@/actions/settings/handleAccountSettingsUpdate';
import {
  getAllAccounts,
  getDefaultExpenseAccount,
  getDefaultIncomeAccount,
  getDefaultTransferSourceAccount,
  getDefaultTransferTargetAccount,
} from '@/api-service';
import { settingsPaths } from '@/constants/settingsPaths';
import { Layout } from '@/layouts/Layout';
import { UserDefaultAccountSettingsForm } from '@/views/user-preferences/UserDefaultAccountSettingsForm';

export const DefaultAccountSettingsContainer: FC = async () => {
  const accounts = await getAllAccounts();

  const defaultIncomeAccount = await getDefaultIncomeAccount();
  const defaultExpenseAccount = await getDefaultExpenseAccount();
  const defaultTransferSourceAccount = await getDefaultTransferSourceAccount();
  const defaultTransferTargetAccount = await getDefaultTransferTargetAccount();

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
