import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';
import { UserPreferenceProperties } from './useUserPreferences';

const targetUserPreference = UserPreferenceProperties.DEFAULT_INCOME_ACCOUNT;

export const useUserDefaultIncomeAccount = (): [
  defaultIncomeAccount: string | undefined,
  setDefaultIncomeAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
