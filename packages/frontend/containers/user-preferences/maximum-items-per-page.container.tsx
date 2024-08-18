'use client';

import { settingsPaths } from '$constants/settings-paths';
import {
  useUserTransactionListChunkSize,
  useUpdateUserTransactionListChunkSize,
} from '$hooks/settings/user-preference/useUserTransactionListChunkSize';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserTransactionListChunkSize,
  UserTransactionListChunkSizeFormFields,
} from '$views/settings/user-preferences/preferences/user-transaction-list-chunk-size';

export const MaximumItemsPerPageContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data: defaultChunkSize } = useUserTransactionListChunkSize();

  const [setDefaultChunkSize] = useUpdateUserTransactionListChunkSize();

  const handleSave = async (
    newUserTransactionListChunkSizeData: UserTransactionListChunkSizeFormFields,
  ) => {
    const { chunkSize } = newUserTransactionListChunkSizeData;

    await setDefaultChunkSize(chunkSize);

    push(settingsPaths.userPreferences);
  };

  return (
    <UserTransactionListChunkSize
      defaultChunkSize={defaultChunkSize}
      onSave={handleSave}
    />
  );
};
