import { useRef, useState } from 'react';

import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Icon, IconName } from '../icon/icon';

import { MobileNavigationActionsBody } from './mobile-navigation.actions.body';

export const MobileNavigationActions = (): JSX.Element => {
  const mobileNavigationActionsBodyRef = useRef();
  const mobileNavigationToggleButtonRef = useRef(null);
  const [isActionsModalHidden, setIsActionsModalHidden] = useState(true);
  useOnClickOutside(
    mobileNavigationActionsBodyRef,
    () => setIsActionsModalHidden(true),
    mobileNavigationToggleButtonRef
  );

  return (
    <li>
      <button
        type="button"
        className={`flex w-full h-full justify-center items-center`}
        aria-expanded={!isActionsModalHidden}
        aria-label="Add new transaction"
        onClick={() => setIsActionsModalHidden(!isActionsModalHidden)}
        ref={mobileNavigationToggleButtonRef}
      >
        <span className={`block bg-blue-financer p-2 rounded-lg text-white`}>
          <Icon
            type={IconName.plus}
            className={`${
              !isActionsModalHidden ? 'rotate-45' : ''
            } transition duration-250 ease-in-out`}
          />
        </span>
      </button>
      <MobileNavigationActionsBody
        isModalHidden={isActionsModalHidden}
        outsideClickRef={mobileNavigationActionsBodyRef}
        onClick={setIsActionsModalHidden}
      />
    </li>
  );
};
