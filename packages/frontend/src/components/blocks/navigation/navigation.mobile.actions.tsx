import clsx from 'clsx';
import { useId } from 'react';

import { Drawer } from '$blocks/drawer/drawer';
import { TransactionFormSwitcher } from '$blocks/TransactionFormSwitcher';
import { Icon } from '$elements/Icon';

interface NavigationMobileActionsProps {
  isActionsModalOpen: boolean;
  setIsActionsModalOpen: (isOpen: boolean) => void;
}

export const NavigationMobileActions = ({
  isActionsModalOpen,
  setIsActionsModalOpen = () => {},
}: NavigationMobileActionsProps): JSX.Element => {
  const id = useId();

  return (
    <li>
      <Drawer
        onClose={() => setIsActionsModalOpen(false)}
        heading="Add Transaction"
        id={id}
      >
        <TransactionFormSwitcher
          typeSwitcherName="transactionTypeSwitcherMobile"
          templateSwitcherName="templateTypeSwitcherMobile"
        />
      </Drawer>
      <button
        type="button"
        className={`flex w-full h-full justify-center items-center popover-open-rotate`}
        aria-expanded={isActionsModalOpen}
        aria-label="Add New Transaction"
        onClick={() => setIsActionsModalOpen(!isActionsModalOpen)}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={id}
      >
        <Icon
          name="PlusIcon"
          className={clsx('transition duration-250 ease-in-out')}
        />
      </button>
    </li>
  );
};
