'use client';

import { useAccountsFindAllByUserQuery } from '$api/generated/financerApi';
import { settingsPaths } from '$constants/settings-paths';
import {
  useUserDefaultExpenseAccount,
  useUpdateUserDefaultExpenseAccount,
} from '$hooks/settings/user-preference/useUserDefaultExpenseAccount';
import {
  useUserDefaultIncomeAccount,
  useUpdateUserDefaultIncomeAccount,
} from '$hooks/settings/user-preference/useUserDefaultIncomeAccount';
import {
  useUserDefaultTransferSourceAccount,
  useUpdateUserDefaultTransferSourceAccount,
} from '$hooks/settings/user-preference/useUserDefaultTransferSourceAccount';
import {
  useUserDefaultTransferTargetAccount,
  useUpdateUserDefaultTransferTargetAccount,
} from '$hooks/settings/user-preference/useUserDefaultTransferTargetAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserDefaultAccountSettings,
  UserDefaultAccountSettingsFormFields,
} from '$views/settings/user-preferences/preferences/user-default-account-settings';

export const DefaultAccountSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data: accounts } = useAccountsFindAllByUserQuery({});

  const { data: defaultIncomeAccount } = useUserDefaultIncomeAccount();
  const { data: defaultExpenseAccount } = useUserDefaultExpenseAccount();
  const { data: defaultTransferSourceAccount } =
    useUserDefaultTransferSourceAccount();
  const { data: defaultTransferTargetAccount } =
    useUserDefaultTransferTargetAccount();

  const [setDefaultIncomeAccount] = useUpdateUserDefaultIncomeAccount();
  const [setDefaultExpenseAccount] = useUpdateUserDefaultExpenseAccount();
  const [setDefaultTransferSourceAccount] =
    useUpdateUserDefaultTransferSourceAccount();
  const [setDefaultTransferTargetAccount] =
    useUpdateUserDefaultTransferTargetAccount();

  const handleSave = async (
    newUserDefaultAccountData: UserDefaultAccountSettingsFormFields,
  ) => {
    const {
      toAccountIncome,
      toAccountTransfer,
      fromAccountExpense,
      fromAccountTransfer,
    } = newUserDefaultAccountData;

    await Promise.all([
      setDefaultIncomeAccount(toAccountIncome),
      setDefaultExpenseAccount(fromAccountExpense),
      setDefaultTransferSourceAccount(fromAccountTransfer),
      setDefaultTransferTargetAccount(toAccountTransfer),
    ]);

    push(settingsPaths.userPreferences);
  };

  return (
    <UserDefaultAccountSettings
      accounts={accounts?.data}
      defaultIncomeAccount={defaultIncomeAccount}
      defaultExpenseAccount={defaultExpenseAccount}
      defaultTransferSourceAccount={defaultTransferSourceAccount}
      defaultTransferTargetAccount={defaultTransferTargetAccount}
      onSave={handleSave}
    />
  );
};
