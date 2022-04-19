import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference =
  UserPreferenceProperty.DEFAULT_TRANSFER_TARGET_ACCOUNT;

export const useUserDefaultTransferTargetAccount = (): [
  defaultTransferTargetAccount: string | undefined,
  setDefaultTransferTargetAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
