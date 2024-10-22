import clsx from 'clsx';
import { FC, useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { TransactionFormSwitcher } from '$blocks/TransactionFormSwitcher';
import { Icon } from '$elements/Icon';

type NavigationCreateTransactionButtonProps = {
  className?: string;
};

export const NavigationCreateTransactionButton: FC<
  NavigationCreateTransactionButtonProps
> = ({ className }) => {
  const id = useId();

  return (
    <li className={clsx(className)}>
      <Drawer heading="Add Transaction" id={id}>
        <TransactionFormSwitcher
          typeSwitcherName="transactionTypeSwitcher"
          templateSwitcherName="templateTypeSwitcher"
        />
      </Drawer>
      <button
        type="button"
        aria-label="Add Transaction"
        className={clsx(
          'items-center justify-center theme-focus',
          'max-lg:flex max-lg:flex-col max-lg:h-full max-lg:w-full',
          'lg:inline-flex lg:gap-2 lg:py-3 lg:px-5 lg:rounded-md lg:border lg:border-transparent',
          'lg:theme-button-secondary',
        )}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={id}
      >
        <Icon name="PlusIcon" />
        <span className="max-lg:hidden">Transaction</span>
      </button>
    </li>
  );
};
