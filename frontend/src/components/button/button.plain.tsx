import React from "react";

interface IProps {
  children: string;
  onClick(): void;
  className: string;
}

const ButtonPlain = ({ children, onClick, className }: IProps): JSX.Element => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={children}
      className={className}
    >
      {children}
    </button>
  );
};

export default ButtonPlain;
