import { useRef, useState } from 'react';

import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { Icon, IconName } from '../icon/icon';

import { DropdownBody } from './dropdown.body';
import { DropdownItem } from './dropdown.item';

export type DropdownItemType = { label: string; onClick(): void };

interface IDropdownProps {
  label: string;
  items: DropdownItemType[];
  className?: string;
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
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md shadow-sm sm:w-auto focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none hover:text-gray-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          ref={dropdownToggleButtonRef}
        >
          {label}
          <Icon
            type={IconName.chevronDown}
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
