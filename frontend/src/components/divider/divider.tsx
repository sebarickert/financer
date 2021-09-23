import React from "react";

interface IDividerProps {
  children: string;
  className?: string;
}

const Divider = ({ children, className = "" }: IDividerProps): JSX.Element => {
  return (
    <div className={`relative ${className || ""}`}>
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-2 bg-white-off text-sm text-gray-500">
          {children}
        </span>
      </div>
    </div>
  );
};

export default Divider;
