'use client';

import { FC } from 'react';

import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { handleAccountDelete } from 'src/actions/account/handleAccountDelete';

type AccountDeleteDrawerProps = {
  id: string;
};

export const AccountDeleteDrawer: FC<AccountDeleteDrawerProps> = ({ id }) => {
  const handleClick = () => handleAccountDelete(id);

  return (
    <Drawer
      id={id}
      heading={'Delete Account'}
      description={'Are you sure you want to permanently delete this account?'}
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
