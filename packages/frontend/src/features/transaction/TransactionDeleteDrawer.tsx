'use client';

import { FC } from 'react';

import { TransactionType } from '$api/generated/financerApi';
import { Drawer } from '$blocks/Drawer';
import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/ButtonGroup';
import { handleTransactionDelete } from 'src/actions/transaction/handleTransactionDelete';

type TransactionDeleteDrawerProps = {
  type: TransactionType;
  id: string;
};

export const TransactionDeleteDrawer: FC<TransactionDeleteDrawerProps> = ({
  type,
  id,
}) => {
  const handleClick = () => handleTransactionDelete(id, type);

  return (
    <Drawer
      id={id}
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
          popoverTarget={id}
        >
          Cancel
        </Button>
      </ButtonGroup>
    </Drawer>
  );
};
