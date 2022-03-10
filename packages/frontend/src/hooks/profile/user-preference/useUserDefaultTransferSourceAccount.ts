import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';
import { UserPreferenceProperties } from './useUserPreferences';

const targetUserPreference =
  UserPreferenceProperties.DEFAULT_TRANSFER_SOURCE_ACCOUNT;

export const useUserDefaultTransferSourceAccount = (): [
  defaultTransferSourceAccount: string | undefined,
  setDefaultTransferSourceAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
