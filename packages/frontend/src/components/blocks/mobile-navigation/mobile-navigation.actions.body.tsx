import { Transition } from '@headlessui/react';

import { IconName } from '../../elements/icon/icon';

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
      show={isModalHidden}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
      className="absolute left-0 right-0 flex justify-center -translate-y-3 bottom-full"
      aria-hidden={isModalHidden}
    >
      <nav
        className="w-full max-w-sm p-2 mx-4 text-white bg-gray-900 rounded-lg shadow-md whitespace-nowrap"
        ref={outsideClickRef}
        aria-label="Quick transaction actions navigation in mobile viewmode."
      >
        <ul className="grid items-center justify-center grid-cols-3">
          <MobileNavigationItem
            label="Income"
            iconName={IconName.download}
            link="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
            onClick={() => onClick(false)}
            hasDarkBackground
          />
          <MobileNavigationItem
            label="Expense"
            iconName={IconName.upload}
            link="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
            onClick={() => onClick(false)}
            hasDarkBackground
          />
          <MobileNavigationItem
            label="Transfer"
            iconName={IconName.switchHorizontal}
            link="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
            onClick={() => onClick(false)}
            hasDarkBackground
          />
        </ul>
      </nav>
    </Transition>
  );
};
