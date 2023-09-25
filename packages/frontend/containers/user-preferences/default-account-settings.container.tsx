import { useAccountsFindAllByUserQuery } from '$api/generated/financerApi';
import {
  useUserDefaultExpenseAccount,
  useUpdateUserDefaultExpenseAccount,
} from '$hooks/profile/user-preference/useUserDefaultExpenseAccount';
import {
  useUserDefaultIncomeAccount,
  useUpdateUserDefaultIncomeAccount,
} from '$hooks/profile/user-preference/useUserDefaultIncomeAccount';
import {
  useUserDefaultTransferSourceAccount,
  useUpdateUserDefaultTransferSourceAccount,
} from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import {
  useUserDefaultTransferTargetAccount,
  useUpdateUserDefaultTransferTargetAccount,
} from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserDefaultAccountSettings,
  UserDefaultAccountSettingsFormFields,
} from '$pages/profile/user-preferences/preferences/user-default-account-settings';

export const DefaultAccountSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data: accounts, isLoading: isLoadingAccount } =
    useAccountsFindAllByUserQuery({});

  const {
    data: defaultIncomeAccount,
    isLoading: isLoadingDefaultIncomeAccount,
  } = useUserDefaultIncomeAccount();
  const {
    data: defaultExpenseAccount,
    isLoading: isLoadingDefaultExpenseAccount,
  } = useUserDefaultExpenseAccount();
  const {
    data: defaultTransferSourceAccount,
    isLoading: isLoadingDefaultTransferSourceAccount,
  } = useUserDefaultTransferSourceAccount();
  const {
    data: defaultTransferTargetAccount,
    isLoading: isLoadingDefaultTransferTargetAccount,
  } = useUserDefaultTransferTargetAccount();

  const [
    setDefaultIncomeAccount,
    { isLoading: isUpdatingDefaultIncomeAccount },
  ] = useUpdateUserDefaultIncomeAccount();
  const [
    setDefaultExpenseAccount,
    { isLoading: isUpdatingDefaultExpenseAccount },
  ] = useUpdateUserDefaultExpenseAccount();
  const [
    setDefaultTransferSourceAccount,
    { isLoading: isUpdatingDefaultTransferSourceAccount },
  ] = useUpdateUserDefaultTransferSourceAccount();
  const [
    setDefaultTransferTargetAccount,
    { isLoading: isUpdatingDefaultTransferTargetAccount },
  ] = useUpdateUserDefaultTransferTargetAccount();

  const handleSave = async (
    newUserDefaultAccountData: UserDefaultAccountSettingsFormFields
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

    push('/profile/user-preferences');
  };

  const isLoading =
    isLoadingAccount ||
    isLoadingDefaultIncomeAccount ||
    isLoadingDefaultExpenseAccount ||
    isLoadingDefaultTransferSourceAccount ||
    isLoadingDefaultTransferTargetAccount;

  const isUpdating =
    isUpdatingDefaultIncomeAccount ||
    isUpdatingDefaultExpenseAccount ||
    isUpdatingDefaultTransferSourceAccount ||
    isUpdatingDefaultTransferTargetAccount;

  return (
    <UserDefaultAccountSettings
      accounts={accounts?.data}
      defaultIncomeAccount={defaultIncomeAccount}
      defaultExpenseAccount={defaultExpenseAccount}
      defaultTransferSourceAccount={defaultTransferSourceAccount}
      defaultTransferTargetAccount={defaultTransferTargetAccount}
      isLoading={isLoading}
      isUpdating={isUpdating}
      onSave={handleSave}
    />
  );
};
