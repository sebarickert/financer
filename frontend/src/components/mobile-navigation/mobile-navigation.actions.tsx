import React, { useEffect, useRef, useState } from "react";
import Icon from "../icon/icon";
import MobileNavigationActionsBody from "./mobile-navigation.actions.body";

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
        typeof secondaryRef !== "undefined" &&
        (!secondaryRef.current || secondaryRef.current.contains(event.target))
      ) {
        return;
      }

      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, secondaryRef, handler]);
}

const MobileNavigationActions = (): JSX.Element => {
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
        className="flex w-full h-full items-center justify-center focus:outline-none focus:ring-blue-600 focus:ring-2 focus:ring-inset"
        aria-expanded={!isActionsModalHidden}
        aria-label="Add new transaction"
        onClick={() => setIsActionsModalHidden(!isActionsModalHidden)}
        ref={mobileNavigationToggleButtonRef}
      >
        <span className="p-2 bg-blue-600 text-white rounded-xl">
          <span
            className={`${
              !isActionsModalHidden ? "rotate-45" : ""
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

export default MobileNavigationActions;
