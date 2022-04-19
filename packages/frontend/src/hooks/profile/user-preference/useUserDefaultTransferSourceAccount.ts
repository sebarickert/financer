import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference =
  UserPreferenceProperty.DEFAULT_TRANSFER_SOURCE_ACCOUNT;

export const useUserDefaultTransferSourceAccount = (): [
  defaultTransferSourceAccount: string | undefined,
  setDefaultTransferSourceAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
