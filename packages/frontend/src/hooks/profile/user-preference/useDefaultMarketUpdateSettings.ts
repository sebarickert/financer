import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference =
  UserPreferenceProperty.UPDATE_INVESTMENT_MARKET_VALUE;

export const useUserDefaultMarketUpdateSettings = (): [
  defaultMarketSettings:
    | { transactionDescription: string; category?: string }
    | undefined,
  setDefaultTransferTargetAccount: ({
    transactionDescription,
    category,
  }: {
    transactionDescription: string;
    category?: string;
  }) => void
] => {
  const [defaultMarketSettings, setDefaultMarketUpdateSettings] =
    useSingleUserPreferenceProperty<{
      transactionDescription: string;
      category?: string;
    }>(targetUserPreference);

  return [defaultMarketSettings, setDefaultMarketUpdateSettings];
};
