import { UserPreferenceProperty } from '@local/types';

import { useSingleUserPreferenceProperty } from './useSingleUserPreferenceProperty';

const targetUserPreference = UserPreferenceProperty.TRANSACTION_LIST_CHUNK_SIZE;

export const useUserTransactionListChunkSize = (): [
  chunkSize: number,
  setChunkSize: (value: number) => void
] => {
  const [chunkSize, setChunkSize] =
    useSingleUserPreferenceProperty<number>(targetUserPreference);

  return [chunkSize ?? 5, setChunkSize];
};
