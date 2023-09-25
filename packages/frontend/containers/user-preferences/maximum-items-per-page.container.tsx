import {
  useUserTransactionListChunkSize,
  useUpdateUserTransactionListChunkSize,
} from '$hooks/profile/user-preference/useUserTransactionListChunkSize';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserTransactionListChunkSize,
  UserTransactionListChunkSizeFormFields,
} from '$pages/profile/user-preferences/preferences/user-transaction-list-chunk-size';

export const MaximumItemsPerPageContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data: defaultChunkSize, isLoading: isLoadingDefault } =
    useUserTransactionListChunkSize();

  const [setDefaultChunkSize, { isLoading: isUpdating }] =
    useUpdateUserTransactionListChunkSize();

  const handleSave = async (
    newUserTransactionListChunkSizeData: UserTransactionListChunkSizeFormFields
  ) => {
    const { chunkSize } = newUserTransactionListChunkSizeData;

    await setDefaultChunkSize(chunkSize);

    push('/profile/user-preferences');
  };

  return (
    <UserTransactionListChunkSize
      defaultChunkSize={defaultChunkSize}
      isLoading={isLoadingDefault}
      isUpdating={isUpdating}
      onSave={handleSave}
    />
  );
};
