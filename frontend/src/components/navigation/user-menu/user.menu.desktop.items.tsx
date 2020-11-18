import React from "react";
import { Transition } from "@headlessui/react";

interface IProps {
  children?: React.ReactNode;
  isOpen: boolean;
}

const UserMenuDesktopItems = ({ children, isOpen }: IProps): JSX.Element => {
  return (
    <Transition
      show={isOpen}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {(ref) => (
        <div
          ref={ref}
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
        >
          <div
            className="py-1 rounded-md bg-white shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            {children}
          </div>
        </div>
      )}
    </Transition>
  );
};

export default UserMenuDesktopItems;
