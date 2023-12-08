import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface UserTransactionListChunkSizeFormFields {
  chunkSize: number;
}

interface UserTransactionListChunkSizeProps {
  defaultChunkSize: number;
  isLoading: boolean;
  isUpdating: boolean;
  onSave: (data: UserTransactionListChunkSizeFormFields) => void;
}

export const UserTransactionListChunkSize = ({
  defaultChunkSize,
  isLoading,
  isUpdating,
  onSave,
}: UserTransactionListChunkSizeProps): JSX.Element | null => {
  const methods = useForm<UserTransactionListChunkSizeFormFields>();

  useEffect(() => {
    methods.reset({ chunkSize: defaultChunkSize });
  }, [defaultChunkSize, methods]);

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Max amount of items per page"
        backLink={settingsPaths.userPreferences}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={onSave}
          submitLabel="Save"
          formFooterBackLink={settingsPaths.userPreferences}
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
