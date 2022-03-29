import { useLocalStorage } from '../../useLocalStorage';

export enum UserPreferenceProperties {
  DEFAULT_INCOME_ACCOUNT = 'DEFAULT_INCOME_ACCOUNT',
  DEFAULT_EXPENSE_ACCOUNT = 'DEFAULT_EXPENSE_ACCOUNT',
  DEFAULT_TRANSFER_SOURCE_ACCOUNT = 'DEFAULT_TRANSFER_SOURCE_ACCOUNT',
  DEFAULT_TRANSFER_TARGET_ACCOUNT = 'DEFAULT_TRANSFER_TARGET_ACCOUNT',
  TRANSACTION_LIST_CHUNK_SIZE = 'TRANSACTION_LIST_CHUNK_SIZE',
  UPDATE_INVESTMENT_MARKET_VALUE = 'UPDATE_INVESTMENT_MARKET_VALUE',
}

type UserPreferenceBase<Key, Value> = {
  type: Key;
  payload: Value;
};

export type UserPreference =
  | UserPreferenceBase<
      typeof UserPreferenceProperties.DEFAULT_INCOME_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperties.DEFAULT_EXPENSE_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperties.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperties.DEFAULT_TRANSFER_TARGET_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperties.TRANSACTION_LIST_CHUNK_SIZE,
      number
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperties.UPDATE_INVESTMENT_MARKET_VALUE,
      { transactionDescription: string; category?: string }
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
