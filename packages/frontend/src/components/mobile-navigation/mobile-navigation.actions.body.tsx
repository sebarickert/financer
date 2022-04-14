import { Transition } from '@headlessui/react';
import React from 'react';

import { IconName } from '../icon/icon';

import { MobileNavigationItem } from './mobile-navigation.item';

interface IMobileNavigationActionsBodyProps {
  isModalHidden: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outsideClickRef: any;
  onClick?(param: boolean): void;
}

export const MobileNavigationActionsBody = ({
  isModalHidden,
  outsideClickRef,
  onClick = () => {},
}: IMobileNavigationActionsBodyProps): JSX.Element => {
  return (
    <Transition
      show={!isModalHidden}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="absolute bottom-full -translate-y-3 left-0 right-0 flex justify-center"
      aria-hidden={isModalHidden}
    >
      <nav
        className="bg-black-off text-white p-2 rounded-lg shadow-md whitespace-nowrap mx-4 max-w-sm w-full"
        ref={outsideClickRef}
        aria-label="Quick transaction actions navigation in mobile viewmode."
      >
        <ul className="grid grid-cols-3 justify-center items-center">
          <MobileNavigationItem
            label="Income"
            iconName={IconName.download}
            link="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
            onClick={() => onClick(true)}
            hasDarkBackground
          />
          <MobileNavigationItem
            label="Expense"
            iconName={IconName.upload}
            link="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
            onClick={() => onClick(true)}
            hasDarkBackground
          />
          <MobileNavigationItem
            label="Transfer"
            iconName={IconName.switchHorizontal}
            link="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
            onClick={() => onClick(true)}
            hasDarkBackground
          />
        </ul>
      </nav>
    </Transition>
  );
};
