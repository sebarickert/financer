'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Input } from '$elements/input/input';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface UserTransactionListChunkSizeFormFields {
  chunkSize: number;
}

interface UserTransactionListChunkSizeProps {
  defaultChunkSize: number;
  onSave: DefaultFormActionHandler;
}

export const UserTransactionListChunkSize: FC<
  UserTransactionListChunkSizeProps
> = ({ defaultChunkSize, onSave }) => {
  const action = useFinancerFormState('transaction-list-chunk-size', onSave);

  const methods = useForm<UserTransactionListChunkSizeFormFields>();

  useEffect(() => {
    methods.reset({ chunkSize: defaultChunkSize });
  }, [defaultChunkSize, methods]);

  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.userPreferences} />
      <Form
        methods={methods}
        action={action}
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
    </>
  );
};
