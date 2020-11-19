import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface IProps {
  isOpen: boolean;
  handleToggleMenu(isOpen: boolean): void;
}

const NavigationMobileToggle = ({
  isOpen,
  handleToggleMenu,
}: IProps): JSX.Element => {
  const location = useLocation();
  useEffect(() => {
    handleToggleMenu(false);
  }, [location, handleToggleMenu]);

  return (
    <div className="-mr-2 flex items-center sm:hidden">
      <button
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
        aria-label="Main menu"
        aria-expanded="false"
        onClick={() => handleToggleMenu(!isOpen)}
        type="button"
      >
        <svg
          className="block h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          className="hidden h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default NavigationMobileToggle;
