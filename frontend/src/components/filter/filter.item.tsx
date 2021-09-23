import React from "react";

interface IFilterProps {
  children: string;
  onClick(): void;
  setActive(): void;
  isActive: boolean;
}

const FilterItem = ({
  children,
  onClick,
  setActive,
  isActive,
}: IFilterProps): JSX.Element => {
  const handleClick = () => {
    setActive();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-lg py-4 focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none border text-sm font-medium md:text-base ${
        isActive ? "bg-black-off text-white" : "bg-white"
      } ${!isActive && "hover:bg-gray-50"}`}
    >
      {children}
    </button>
  );
};

export default FilterItem;
