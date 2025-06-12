'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { TransactionType } from '@/api/ssr-financer-api';
import { Drawer } from '@/blocks/Drawer';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { useFinancerFormState } from '@/hooks/useFinancerFormState';
import { handleTransactionDelete } from 'src/actions/transaction/handleTransactionDelete';

interface TransactionDeleteDrawerProps {
  type: TransactionType;
  id: string;
}

export const TransactionDeleteDrawer: FC<TransactionDeleteDrawerProps> = ({
  type,
  id,
}) => {
  const onSubmit = handleTransactionDelete.bind(null, { id, type });
  const action = useFinancerFormState('transaction-delete-form', onSubmit);
  const methods = useForm();

  return (
    <Drawer
      id={id}
      heading={'Delete Transaction'}
      description={
        'Are you sure you want to permanently delete this transaction?'
      }
    >
      <Form methods={methods} action={action}>
        <Form.Footer>
          <Button type="submit" accentColor="danger">
            Delete
          </Button>
          <Button accentColor="secondary" command="close" commandFor={id}>
            Cancel
          </Button>
        </Form.Footer>
      </Form>
    </Drawer>
  );
};
