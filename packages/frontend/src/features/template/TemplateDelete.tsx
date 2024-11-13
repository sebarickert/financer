'use client';

import { useId } from 'react';

import { handleTemplateDelete } from '$actions/template/handleTemplateDelete';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { Icon } from '$elements/Icon';

type TemplateDeleteProps = {
  id: string;
};

export const TemplateDelete = ({ id }: TemplateDeleteProps) => {
  const popoverId = useId();

  const handleDelete = () => handleTemplateDelete(id);

  return (
    <>
      <Button accentColor="secondary" size="icon" popoverTarget={popoverId}>
        <Icon name={'TrashIcon'} />
        <span className="sr-only">Delete</span>
      </Button>
      <Drawer
        id={popoverId}
        heading={'Delete Template'}
        description={
          'Are you sure you want to permanently delete this template?'
        }
      >
        <ButtonGroup>
          <Button haptic="heavy" accentColor={'danger'} onClick={handleDelete}>
            Delete
          </Button>
          <Button
            haptic="light"
            accentColor="secondary"
            popoverTargetAction="hide"
            popoverTarget={popoverId}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
