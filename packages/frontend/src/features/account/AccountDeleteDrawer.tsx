'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { Drawer } from '@/blocks/Drawer';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { useFinancerFormState } from '@/hooks/useFinancerFormState';
import { handleAccountDelete } from 'src/actions/account/handleAccountDelete';

interface AccountDeleteDrawerProps {
  id: string;
}

export const AccountDeleteDrawer: FC<AccountDeleteDrawerProps> = ({ id }) => {
  const onSubmit = handleAccountDelete.bind(null, { id });
  const action = useFinancerFormState('account-delete-form', onSubmit);
  const methods = useForm();

  return (
    <Drawer
      id={id}
      heading={'Delete Account'}
      description={'Are you sure you want to permanently delete this account?'}
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
