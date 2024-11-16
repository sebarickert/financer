'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { Drawer } from '$blocks/drawer123/drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { Icon } from '$elements/Icon';
import { handleAccountDelete } from 'src/actions/account/handleAccountDelete';

type AccountDeletePopperItemProps = {
  id: string;
};

export const AccountDeletePopperItem: FC<AccountDeletePopperItemProps> = ({
  id,
}) => {
  const popperId = useId();

  const handleClick = () => handleAccountDelete(id);

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
        heading={'Delete Account'}
        description={
          'Are you sure you want to permanently delete this account?'
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
