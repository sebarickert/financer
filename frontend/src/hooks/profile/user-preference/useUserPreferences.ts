import { useLocalStorage } from '../../useLocalStorage';

export enum UserPreferenceProperties {
  DEFAULT_INCOME_ACCOUNT = 'DEFAULT_INCOME_ACCOUNT',
  DEFAULT_EXPENSE_ACCOUNT = 'DEFAULT_EXPENSE_ACCOUNT',
  DEFAULT_TRANSFER_SOURCE_ACCOUNT = 'DEFAULT_TRANSFER_SOURCE_ACCOUNT',
  DEFAULT_TRANSFER_TARGET_ACCOUNT = 'DEFAULT_TRANSFER_TARGET_ACCOUNT',
}

type UserPrefenceBase<Key, Value> = {
  type: Key;
  payload: Value;
};

export type UserPreference =
  | UserPrefenceBase<
      typeof UserPreferenceProperties.DEFAULT_INCOME_ACCOUNT,
      string
    >
  | UserPrefenceBase<
      typeof UserPreferenceProperties.DEFAULT_EXPENSE_ACCOUNT,
      string
    >
  | UserPrefenceBase<
      typeof UserPreferenceProperties.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
      string
    >
  | UserPrefenceBase<
      typeof UserPreferenceProperties.DEFAULT_TRANSFER_TARGET_ACCOUNT,
      string
    >;

export const useUserPreferences = (): [
  UserPreference[],
  (value: UserPreference[]) => void
] => {
  const [userPreferences, setUserPreferences] = useLocalStorage<
    UserPreference[]
  >('userPreferences', []);

  return [userPreferences, setUserPreferences];
};
