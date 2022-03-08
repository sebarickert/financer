import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';
import { UserPreferenceProperties } from './useUserPreferences';

const targetUserPreference =
  UserPreferenceProperties.TRANSACTION_LIST_CHUNK_SIZE;

export const useUserTransactionListChunkSize = (): [
  chunkSize: number | undefined,
  setChunkSize: (value: number) => void
] => {
  const [chunkSize, setChunkSize] =
    useSingleUserPreferenceProperty<number>(targetUserPreference);

  return [chunkSize, setChunkSize];
};
