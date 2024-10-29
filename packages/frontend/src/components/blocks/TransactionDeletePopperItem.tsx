'use client';

import clsx from 'clsx';
import { FC, useId } from 'react';

import { Drawer } from './drawer/drawer';

import { Button } from '$elements/button/button';
import { ButtonGroup } from '$elements/button/button.group';
import { Icon } from '$elements/Icon';

type TransactionDeletePopperItemProps = {};

export const TransactionDeletePopperItem: FC<
  TransactionDeletePopperItemProps
> = ({}) => {
  const id = useId();

  return (
    <>
      <button
        className={clsx(
          'flex w-full items-center gap-2 px-2 py-1.5 theme-focus theme-bg-color-with-hover',
        )}
      >
        <Icon name={'TrashIcon'} className="!w-5 !h-5" />
        <span className="inline-block pr-2">{'Delete'}</span>
      </button>
      <Drawer
        id={id}
        heading={'Delete Transaction'}
        description={
          'Are you sure you want to permanently delete this transaction?'
        }
      >
        <ButtonGroup isReverse isHorizontal>
          <Button
            haptic="heavy"
            accentColor={'danger'}
            // onClick={() => onSubmit()}
            // testId={`${buttonTestId}-confirm`}
          >
            {'Delete'}
          </Button>
          <Button
            haptic="light"
            accentColor="secondary"
            // testId={`${buttonTestId}-cancel`}
            popoverTargetAction="hide"
            popoverTarget={id}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Drawer>
    </>
  );
};
