import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';
import { UserPreferenceProperties } from './useUserPreferences';

const targetUserPreference = UserPreferenceProperties.DEFAULT_EXPENSE_ACCOUNT;

export const useUserDefaultExpenseAccount = (): [
  defaultExpenseAccount: string | undefined,
  setDefaultExpenseAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
