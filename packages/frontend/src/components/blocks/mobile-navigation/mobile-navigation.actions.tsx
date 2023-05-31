import clsx from 'clsx';
import { useRef, useState } from 'react';

import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import { Icon, IconName } from '../../elements/icon/icon';

import { MobileNavigationActionsBody } from './mobile-navigation.actions.body';

import { Drawer } from '$blocks/drawer/drawer';

export const MobileNavigationActions = (): JSX.Element => {
  const mobileNavigationActionsBodyRef = useRef();
  const mobileNavigationToggleButtonRef = useRef(null);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);

  const [plaa, setPlaa] = useState(false);

  useOnClickOutside(
    mobileNavigationActionsBodyRef,
    () => setIsActionsModalOpen(false),
    mobileNavigationToggleButtonRef
  );

  return (
    <li>
      <button
        type="button"
        className={`flex w-full h-full justify-center items-center`}
        aria-expanded={isActionsModalOpen}
        aria-label="Add new transaction"
        onClick={() => setPlaa(!isActionsModalOpen)}
        ref={mobileNavigationToggleButtonRef}
      >
        <Icon
          type={IconName.plus}
          className={clsx('transition duration-250 ease-in-out', {
            ['rotate-45']: isActionsModalOpen,
          })}
        />
      </button>
      <MobileNavigationActionsBody
        isModalOpen={isActionsModalOpen}
        outsideClickRef={mobileNavigationActionsBodyRef}
        onClick={setIsActionsModalOpen}
      />
      <Drawer
        isOpen={plaa}
        onClose={() => setPlaa(false)}
        heading="Update market value"
      >
        plaa
      </Drawer>
    </li>
  );
};
