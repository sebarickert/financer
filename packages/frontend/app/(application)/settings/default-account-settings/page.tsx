import { Metadata } from 'next';

import { handleAccountSettingsUpdate } from '@/actions/settings/handleAccountSettingsUpdate';
import { RequireAccounts } from '@/components/RequireAccounts';
import { settingsPaths } from '@/constants/settingsPaths';
import { ContentHeader } from '@/layouts/ContentHeader';
import { AccountService } from '@/ssr/api/AccountService';
import { UserPreferenceService } from '@/ssr/api/UserPreferenceService';
import { UserDefaultAccountSettingsForm } from '@/views/user-preferences/UserDefaultAccountSettingsForm';

export const metadata: Metadata = {
  title: 'Default Account Settings',
};

export default async function DefaultAccountSettingsUserPreferencePage() {
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
    <>
      <ContentHeader
        title="Default Account Settings"
        backLink={settingsPaths.default}
      />
      <RequireAccounts>
        <UserDefaultAccountSettingsForm
          accounts={accounts}
          defaultIncomeAccount={defaultIncomeAccount}
          defaultExpenseAccount={defaultExpenseAccount}
          defaultTransferSourceAccount={defaultTransferSourceAccount}
          defaultTransferTargetAccount={defaultTransferTargetAccount}
          onSave={handleAccountSettingsUpdate}
        />
      </RequireAccounts>
    </>
  );
}
