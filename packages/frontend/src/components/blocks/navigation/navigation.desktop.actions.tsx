'use client';

import clsx from 'clsx';
import { useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { TransactionFormSwitcher } from '$blocks/TransactionFormSwitcher';
import { Icon } from '$elements/Icon';

export const NavigationDesktopActions = (): JSX.Element => {
  const id = useId();

  return (
    <li>
      <Drawer heading="Add Transaction" id={id}>
        <TransactionFormSwitcher />
      </Drawer>
      <button
        type="button"
        className={`flex items-center p-4 hover:bg-gray-dark rounded-md w-full`}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={id}
      >
        <Icon name="PlusIcon" />
        <span className={clsx('ml-4 text-base')}>{'Add New Transaction'}</span>
      </button>
    </li>
  );
};
