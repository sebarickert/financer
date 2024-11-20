'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Drawer } from '$blocks/Drawer';
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
      <Button
        accentColor="unstyled"
        popoverTarget={popperId}
        className={clsx(
          'py-2.5 h-11 px-[18px] text-base text-foreground',
          'w-full !justify-start theme-bg-color-with-hover',
          '!pl-2',
        )}
      >
        <Icon name={'TrashIcon'} />
        <span className="inline-block pr-2">Delete</span>
      </Button>
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
