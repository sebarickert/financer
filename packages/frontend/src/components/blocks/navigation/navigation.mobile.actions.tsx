import clsx from 'clsx';

import { Drawer } from '$blocks/drawer/drawer';
import { TransactionActions } from '$blocks/transaction-actions/transaction-actions';
import { Icon } from '$elements/Icon';

interface NavigationMobileActionsProps {
  isActionsModalOpen: boolean;
  setIsActionsModalOpen: (isOpen: boolean) => void;
}

export const NavigationMobileActions = ({
  isActionsModalOpen,
  setIsActionsModalOpen = () => {},
}: NavigationMobileActionsProps): JSX.Element => {
  return (
    <li>
      <button
        type="button"
        className={`flex w-full h-full justify-center items-center`}
        aria-expanded={isActionsModalOpen}
        aria-label="Add new transaction"
        onClick={() => setIsActionsModalOpen(!isActionsModalOpen)}
      >
        <Icon
          name="PlusIcon"
          className={clsx('transition duration-250 ease-in-out', {
            ['rotate-45']: isActionsModalOpen,
          })}
        />
      </button>
      <Drawer
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        heading="Add transaction"
      >
        <TransactionActions
          onClick={setIsActionsModalOpen}
          transition="slideInFromBottom"
        />
      </Drawer>
    </li>
  );
};
