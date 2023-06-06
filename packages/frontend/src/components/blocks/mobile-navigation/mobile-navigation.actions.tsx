import clsx from 'clsx';
import { useState } from 'react';

import { Icon, IconName } from '../../elements/icon/icon';

import { Drawer } from '$blocks/drawer/drawer';
import { TransactionActions } from '$blocks/transaction-actions/transaction-actions';

export const MobileNavigationActions = (): JSX.Element => {
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

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
          type={IconName.plus}
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
        <TransactionActions onClick={setIsActionsModalOpen} />
      </Drawer>
    </li>
  );
};
