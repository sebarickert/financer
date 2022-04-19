import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference = UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT;

export const useUserDefaultExpenseAccount = (): [
  defaultExpenseAccount: string | undefined,
  setDefaultExpenseAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
