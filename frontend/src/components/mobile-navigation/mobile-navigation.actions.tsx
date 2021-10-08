/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

import { isIOSDevice } from '../../utils/isIOSDevice';
import { Icon } from '../icon/icon';

import { MobileNavigationActionsBody } from './mobile-navigation.actions.body';

function useOnClickOutside(
  ref: any,
  handler: any,
  secondaryRef: any = undefined
) {
  useEffect(() => {
    const listener = (event: any) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      if (
        typeof secondaryRef !== 'undefined' &&
        (!secondaryRef.current || secondaryRef.current.contains(event.target))
      ) {
        return;
      }

      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, secondaryRef, handler]);
}

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
        className={`flex w-full h-full justify-center ${
          isIOSDevice() ? 'items-start pt-4' : 'items-center'
        }`}
        aria-expanded={!isActionsModalHidden}
        aria-label="Add new transaction"
        onClick={() => setIsActionsModalHidden(!isActionsModalHidden)}
        ref={mobileNavigationToggleButtonRef}
      >
        <span className="p-2 bg-blue-financer text-white rounded-xl">
          <span
            className={`${
              !isActionsModalHidden ? 'rotate-45' : ''
            } transition duration-250 ease-in-out block`}
          >
            <Icon type="plus" />
          </span>
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
