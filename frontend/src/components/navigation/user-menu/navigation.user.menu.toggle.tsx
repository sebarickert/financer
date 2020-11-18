import React from "react";

interface IProps {
  handleToggle(isOpen: boolean): void;
  isOpen: boolean;
}

const NavigationUserMenuToggle = ({
  handleToggle,
  isOpen,
}: IProps): JSX.Element => {
  return (
    <div>
      <button
        className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
        id="user-menu"
        aria-label="User menu"
        aria-haspopup="true"
        type="button"
        onClick={() => handleToggle(!isOpen)}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  );
};

export default NavigationUserMenuToggle;
