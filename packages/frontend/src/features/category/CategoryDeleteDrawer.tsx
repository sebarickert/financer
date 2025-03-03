'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';

import { handleCategoryDelete } from '@/actions/category/handleCategoryDelete';
import { Drawer } from '@/blocks/Drawer';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { useFinancerFormState } from '@/hooks/useFinancerFormState';

interface CategoryDeleteDrawerProps {
  id: string;
}

export const CategoryDeleteDrawer: FC<CategoryDeleteDrawerProps> = ({ id }) => {
  const onSubmit = handleCategoryDelete.bind(null, { id });
  const action = useFinancerFormState('category-delete-form', onSubmit);
  const methods = useForm();

  return (
    <Drawer
      id={id}
      heading={'Delete Category'}
      description={'Are you sure you want to permanently delete this category?'}
    >
      <Form methods={methods} action={action}>
        <Form.Footer>
          <Button type="submit" accentColor="danger">
            Delete
          </Button>
          <Button
            accentColor="secondary"
            popoverTargetAction="hide"
            popoverTarget={id}
          >
            Cancel
          </Button>
        </Form.Footer>
      </Form>
    </Drawer>
  );
};
