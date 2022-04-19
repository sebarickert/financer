import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference = UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT;

export const useUserDefaultIncomeAccount = (): [
  defaultIncomeAccount: string | undefined,
  setDefaultIncomeAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
