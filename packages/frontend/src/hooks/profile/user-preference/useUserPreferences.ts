import { UserPreferenceProperty } from '@local/types';

import { useLocalStorage } from '../../useLocalStorage';

import { UserDefaultMarketUpdateSettings } from './useDefaultMarketUpdateSettings';

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
      UserDefaultMarketUpdateSettings
    >
  | UserPreferenceBase<typeof UserPreferenceProperty.DASHBOARD_SETTINGS, number>
  | UserPreferenceBase<
      typeof UserPreferenceProperty.STATISTICS_SETTINGS,
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
