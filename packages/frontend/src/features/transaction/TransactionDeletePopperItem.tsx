'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { Icon } from '$elements/Icon';
import { handleTransactionDelete } from 'src/actions/transaction/handleTransactionDelete';

type TransactionDeletePopperItemProps = {
  type: TransactionType;
  id: string;
};

export const TransactionDeletePopperItem: FC<
  TransactionDeletePopperItemProps
> = ({ type, id }) => {
  const popperId = useId();

  const handleClick = () => handleTransactionDelete(id, type);

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
        heading={'Delete Transaction'}
        description={
          'Are you sure you want to permanently delete this transaction?'
        }
      >
        <ButtonGroup>
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
