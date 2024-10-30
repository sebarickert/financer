'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
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
      <button
        className={clsx(
          'flex w-full items-center gap-2 px-2 py-1.5 theme-focus theme-bg-color-with-hover',
        )}
        popoverTarget={popperId}
      >
        <Icon name={'TrashIcon'} className="!w-5 !h-5" />
        <span className="inline-block pr-2">{'Delete'}</span>
      </button>
      <Drawer
        id={popperId}
        heading={'Delete Account'}
        description={
          'Are you sure you want to permanently delete this account?'
        }
      >
        <ButtonGroup isReverse isHorizontal>
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
