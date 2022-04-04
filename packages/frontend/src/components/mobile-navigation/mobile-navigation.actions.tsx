import React, { useEffect, useRef, useState } from 'react';

import { Icon } from '../icon/icon';

import { MobileNavigationActionsBody } from './mobile-navigation.actions.body';

function useOnClickOutside(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  ref: any,
  handler: any,
  secondaryRef: any = undefined
  /* eslint-enable @typescript-eslint/no-explicit-any */
) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        className={`flex w-full h-full justify-center items-center`}
        aria-expanded={!isActionsModalHidden}
        aria-label="Add new transaction"
        onClick={() => setIsActionsModalHidden(!isActionsModalHidden)}
        ref={mobileNavigationToggleButtonRef}
      >
        <span className="p-2 text-white bg-blue-financer rounded-xl">
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
