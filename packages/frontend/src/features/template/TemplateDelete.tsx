'use client';

import { Trash } from 'lucide-react';
import { useId } from 'react';
import { useForm } from 'react-hook-form';

import { handleTemplateDelete } from '@/actions/template/handleTemplateDelete';
import { Drawer } from '@/blocks/Drawer';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { useFinancerFormState } from '@/hooks/useFinancerFormState';

interface TemplateDeleteProps {
  id: string;
}

export const TemplateDelete = ({ id }: TemplateDeleteProps) => {
  const drawerId = useId();

  const onSubmit = handleTemplateDelete.bind(null, { id });
  const action = useFinancerFormState('category-delete-form', onSubmit);
  const methods = useForm();

  return (
    <>
      <Button
        accentColor="danger"
        size="small"
        commandFor={drawerId}
        command="show-modal"
        isPill
        className="[&_svg]:size-4!"
      >
        <Trash />
        Delete
      </Button>
      <Drawer
        id={drawerId}
        heading={'Delete Template'}
        description={
          'Are you sure you want to permanently delete this template?'
        }
      >
        <Form methods={methods} action={action}>
          <Form.Footer>
            <Button type="submit" accentColor="danger">
              Delete
            </Button>
            <Button
              accentColor="secondary"
              command="close"
              commandFor={drawerId}
            >
              Cancel
            </Button>
          </Form.Footer>
        </Form>
      </Drawer>
    </>
  );
};
