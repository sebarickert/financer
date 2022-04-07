import { Transition } from '@headlessui/react';
import React from 'react';

interface IDropdownBodyProps {
  children: React.ReactNode[];
  className?: string;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outsideClickRef: any;
}

export const DropdownBody = ({
  children,
  className = '',
  isOpen,
  outsideClickRef,
}: IDropdownBodyProps): JSX.Element => {
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
      <div
        className={`origin-top-right absolute right-0 mt-2 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10 ${className}`}
        ref={outsideClickRef}
      >
        <div className="py-1">{children}</div>
      </div>
    </Transition>
  );
};
