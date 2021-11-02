/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

import { Icon } from '../icon/icon';

import { DropdownBody } from './dropdown.body';
import { DropdownItem } from './dropdown.item';

export type DropdownItemType = { label: string; onClick(): void };

interface IDropdownProps {
  label: string;
  items: DropdownItemType[];
  className?: string;
}

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

export const Dropdown = ({
  label,
  items,
  className = '',
}: IDropdownProps): JSX.Element => {
  const dropdownBodyRef = useRef();
  const dropdownToggleButtonRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActiveIndex, setIsActiveIndex] = useState(0);

  useOnClickOutside(
    dropdownBodyRef,
    () => setIsDropdownOpen(false),
    dropdownToggleButtonRef
  );

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full sm:w-auto rounded-md items-center py-2 px-4 border font-medium text-sm focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150 border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={dropdownToggleButtonRef}
        >
          {label}
          <Icon
            type="chevron-down"
            aria-hidden="true"
            className="-mr-1 ml-1 !h-5 !w-5"
          />
        </button>
      </div>
      <DropdownBody isOpen={isDropdownOpen} outsideClickRef={dropdownBodyRef}>
        {items.map(({ label: itemLabel, onClick }, index) => (
          <DropdownItem
            onClick={() => {
              onClick();
              setIsDropdownOpen(false);
            }}
            setActive={() => setIsActiveIndex(index)}
            key={`dropdown-item-${itemLabel}`}
            isActive={isActiveIndex === index}
          >
            {itemLabel}
          </DropdownItem>
        ))}
      </DropdownBody>
    </div>
  );
};
