'use client';

import { FC } from 'react';

import { handleCategoryDelete } from '$actions/category/handleCategoryDelete';
import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';

type CategoryDeleteDrawerProps = {
  id: string;
};

export const CategoryDeleteDrawer: FC<CategoryDeleteDrawerProps> = ({ id }) => {
  const handleClick = () => handleCategoryDelete(id);

  return (
    <Drawer
      id={id}
      heading={'Delete Category'}
      description={'Are you sure you want to permanently delete this category?'}
    >
      <ButtonGroup>
        <Button haptic="heavy" accentColor={'danger'} onClick={handleClick}>
          Delete
        </Button>
        <Button
          haptic="light"
          accentColor="secondary"
          popoverTargetAction="hide"
          popoverTarget={id}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Drawer>
  );
};
