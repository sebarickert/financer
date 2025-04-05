import { Metadata } from 'next';

import { handleAccountSettingsUpdate } from '@/actions/settings/handleAccountSettingsUpdate';
import {
  getAllAccounts,
  getDefaultExpenseAccount,
  getDefaultIncomeAccount,
  getDefaultTransferSourceAccount,
  getDefaultTransferTargetAccount,
} from '@/api-service';
import { RequireAccounts } from '@/components/RequireAccounts';
import { generateUserPreferenceViewTransitionName } from '@/features/settings/generateUserPreferenceViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';
import { UserDefaultAccountSettingsForm } from '@/views/user-preferences/UserDefaultAccountSettingsForm';

export const metadata: Metadata = {
  title: 'Default Account Settings',
};

export default async function DefaultAccountSettingsUserPreferencePage() {
  const accounts = await getAllAccounts();

  const defaultIncomeAccount = await getDefaultIncomeAccount();
  const defaultExpenseAccount = await getDefaultExpenseAccount();
  const defaultTransferSourceAccount = await getDefaultTransferSourceAccount();
  const defaultTransferTargetAccount = await getDefaultTransferTargetAccount();

  const vtNames = generateUserPreferenceViewTransitionName('default-account');

  return (
    <>
      <ContentHeader
        title="Default Account Settings"
        titleVtName={vtNames.title}
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
