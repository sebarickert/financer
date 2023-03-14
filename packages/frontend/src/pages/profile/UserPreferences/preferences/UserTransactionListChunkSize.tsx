import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Form } from '$blocks/form/form';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import {
  useUpdateUserTransactionListChunkSize,
  useUserTransactionListChunkSize,
} from '$hooks/profile/user-preference/useUserTransactionListChunkSize';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface UserTransactionListChunkSizeFormFields {
  chunkSize: number;
}

export const UserTransactionListChunkSize = (): JSX.Element | null => {
  const methods = useForm<UserTransactionListChunkSizeFormFields>();
  const navigate = useNavigate();
  const { data: defaultChunkSize, isLoading: isLoadingDefault } =
    useUserTransactionListChunkSize();

  const [setDefaultChunkSize, { isLoading: isUpdating }] =
    useUpdateUserTransactionListChunkSize();

  const handleSave = async (
    newUserTransactionListChunkSizeData: UserTransactionListChunkSizeFormFields
  ) => {
    const { chunkSize } = newUserTransactionListChunkSizeData;

    await setDefaultChunkSize(chunkSize);

    navigate('/profile/user-preferences');
  };

  useEffect(() => {
    methods.reset({ chunkSize: defaultChunkSize });
  }, [defaultChunkSize, methods]);

  const isLoading = isLoadingDefault;

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Max amount of items per page"
        backLink={'/profile/user-preferences'}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={handleSave}
          submitLabel="Save"
          formFooterBackLink="/profile/user-preferences"
        >
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input
              id="chunkSize"
              type="number"
              min={3}
              step={1}
              max={100}
              isRequired
              value={defaultChunkSize}
            >
              Items per page, e.g. transactions
            </Input>
          </div>
        </Form>
      )}
    </>
  );
};
