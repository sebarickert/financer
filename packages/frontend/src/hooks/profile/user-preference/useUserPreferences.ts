import { useLocalStorage } from '../../useLocalStorage';

export enum UserPreferenceProperties {
  DEFAULT_INCOME_ACCOUNT = 'DEFAULT_INCOME_ACCOUNT',
  DEFAULT_EXPENSE_ACCOUNT = 'DEFAULT_EXPENSE_ACCOUNT',
  DEFAULT_TRANSFER_SOURCE_ACCOUNT = 'DEFAULT_TRANSFER_SOURCE_ACCOUNT',
  DEFAULT_TRANSFER_TARGET_ACCOUNT = 'DEFAULT_TRANSFER_TARGET_ACCOUNT',
  TRANSACTION_LIST_CHUNK_SIZE = 'TRANSACTION_LIST_CHUNK_SIZE',
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
    >
  | UserPrefenceBase<
      typeof UserPreferenceProperties.TRANSACTION_LIST_CHUNK_SIZE,
      number
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
