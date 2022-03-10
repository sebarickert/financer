import React from 'react';

interface IDropdownItemProps {
  children: string;
  onClick(): void;
  setActive(): void;
  isActive: boolean;
}

export const DropdownItem = ({
  children,
  onClick,
  setActive,
  isActive,
}: IDropdownItemProps): JSX.Element => {
  const handleClick = () => {
    setActive();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group flex px-4 py-2 text-sm w-full ${
        isActive ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-900'
      } ${!isActive && 'hover:bg-gray-50'}`}
    >
      {children}
    </button>
  );
};
