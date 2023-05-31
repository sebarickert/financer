import clsx from 'clsx';

import { IconName } from '../../elements/icon/icon';

import { MobileNavigationItem } from './mobile-navigation.item';

interface IMobileNavigationActionsBodyProps {
  isModalOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outsideClickRef: any;
  onClick?(param: boolean): void;
}

export const MobileNavigationActionsBody = ({
  isModalOpen,
  outsideClickRef,
  onClick = () => {},
}: IMobileNavigationActionsBodyProps): JSX.Element => {
  return (
    <section
      className={clsx(
        'absolute left-0 right-0 flex justify-center -translate-y-3 bottom-full',
        { ['hidden']: !isModalOpen }
      )}
      aria-hidden={!isModalOpen}
    >
      <nav
        className="w-full max-w-sm p-2 mx-4 rounded-md text-gray-dark bg-charcoal whitespace-nowrap"
        ref={outsideClickRef}
        aria-label="Quick transaction actions navigation in mobile viewmode"
      >
        <ul className="grid items-center justify-center grid-cols-3">
          <MobileNavigationItem
            label="Income"
            iconName={IconName.download}
            url="/statistics/incomes/add"
            ariaLabel="Add new income transaction"
            onClick={() => onClick(false)}
          />
          <MobileNavigationItem
            label="Expense"
            iconName={IconName.upload}
            url="/statistics/expenses/add"
            ariaLabel="Add new expense transaction"
            onClick={() => onClick(false)}
          />
          <MobileNavigationItem
            label="Transfer"
            iconName={IconName.switchHorizontal}
            url="/statistics/transfers/add"
            ariaLabel="Add new transfer transaction"
            onClick={() => onClick(false)}
          />
        </ul>
      </nav>
    </section>
  );
};
