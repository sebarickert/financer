'use client';

import clsx from 'clsx';
import { useId } from 'react';

import { handleTemplateDelete } from '$actions/template/handleTemplateDelete';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/button.group';
import { Icon } from '$elements/Icon';

type TemplateDeleteProps = {
  id: string;
};

export const TemplateDelete = ({ id }: TemplateDeleteProps) => {
  const popoverId = useId();

  const handleDelete = () => handleTemplateDelete(id);

  return (
    <>
      <Button
        accentColor="secondary"
        className={clsx(
          '!h-11 !w-11 !p-0 inline-flex justify-center items-center',
        )}
        popoverTarget={popoverId}
      >
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
        <ButtonGroup isReverse isHorizontal>
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
