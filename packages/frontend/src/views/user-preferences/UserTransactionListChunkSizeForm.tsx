'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '$blocks/Form';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

export type UserTransactionListChunkSizeFormFields = {
  chunkSize: number;
};

type UserTransactionListChunkSizeFormProps = {
  defaultChunkSize: number;
  onSave: DefaultFormActionHandler;
};

export const UserTransactionListChunkSizeForm: FC<
  UserTransactionListChunkSizeFormProps
> = ({ defaultChunkSize, onSave }) => {
  const action = useFinancerFormState('transaction-list-chunk-size', onSave);

  const methods = useForm<UserTransactionListChunkSizeFormFields>();

  useEffect(() => {
    methods.reset({ chunkSize: defaultChunkSize });
  }, [defaultChunkSize, methods]);

  return (
    <Form
      methods={methods}
      action={action}
      testId="dashboard-chunk-size-settings-form"
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
      <Form.Footer>
        <Button type="submit">Save</Button>
      </Form.Footer>
    </Form>
  );
};
