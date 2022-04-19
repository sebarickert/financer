import { UserPreferenceProperty } from '@local/types';

import { useLocalStorage } from '../../useLocalStorage';

type UserPreferenceBase<Key, Value> = {
  type: Key;
  payload: Value;
};

export type UserPreference =
  | UserPreferenceBase<
      typeof UserPreferenceProperty.DEFAULT_INCOME_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperty.DEFAULT_EXPENSE_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT,
      string
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE,
      number
    >
  | UserPreferenceBase<
      typeof UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE,
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
