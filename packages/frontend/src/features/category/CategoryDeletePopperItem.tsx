'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { handleCategoryDelete } from '$actions/category/handleCategoryDelete';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/Button1/Button';
import { ButtonGroup } from '$elements/Button1/ButtonGroup';
import { Icon } from '$elements/Icon';

type CategoryDeletePopperItemProps = {
  id: string;
};

export const CategoryDeletePopperItem: FC<CategoryDeletePopperItemProps> = ({
  id,
}) => {
  const popperId = useId();

  const handleClick = () => handleCategoryDelete(id);

  return (
    <>
      <Button
        accentColor="unstyled"
        popoverTarget={popperId}
        className={clsx(
          'py-2.5 h-11 px-[18px] text-base',
          'w-full !justify-start theme-bg-color-with-hover',
          '!pl-2',
        )}
      >
        <Icon name={'TrashIcon'} />
        <span className="inline-block pr-2">Delete</span>
      </Button>
      <Drawer
        id={popperId}
        heading={'Delete Category'}
        description={
          'Are you sure you want to permanently delete this category?'
        }
      >
        <ButtonGroup>
          <Button haptic="heavy" accentColor={'danger'} onClick={handleClick}>
            Delete
          </Button>
          <Button
            haptic="light"
            accentColor="secondary"
            popoverTargetAction="hide"
            popoverTarget={popperId}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
