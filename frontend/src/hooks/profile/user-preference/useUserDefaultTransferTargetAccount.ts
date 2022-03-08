import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';
import { UserPreferenceProperties } from './useUserPreferences';

const targetUserPreference =
  UserPreferenceProperties.DEFAULT_TRANSFER_TARGET_ACCOUNT;

export const useUserDefaultTransferTargetAccount = (): [
  defaultTransferTargetAccount: string | undefined,
  setDefaultTransferTargetAccount: (value: string) => void
] => {
  const [account, setAccout] =
    useSingleUserPreferenceProperty<string>(targetUserPreference);

  return [account, setAccout];
};
