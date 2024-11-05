'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { handleCategoryDelete } from '$actions/category/handleCategoryDelete';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
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
      <button
        className={clsx(
          'flex w-full items-center gap-2 px-2 py-1.5 theme-focus theme-bg-color-with-hover',
        )}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={popperId}
      >
        <Icon name={'TrashIcon'} className="!w-5 !h-5" />
        <span className="inline-block pr-2">{'Delete'}</span>
      </button>
      <Drawer
        id={popperId}
        heading={'Delete Category'}
        description={
          'Are you sure you want to permanently delete this category?'
        }
      >
        <ButtonGroup isReverse isHorizontal>
          <Button haptic="heavy" accentColor={'danger'} onClick={handleClick}>
            {'Delete'}
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
