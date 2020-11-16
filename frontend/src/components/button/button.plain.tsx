/* eslint-disable react/button-has-type */
import React from "react";

interface IProps {
  children: string;
  onClick(): void;
  className: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const ButtonPlain = ({
  children,
  onClick,
  className,
  type = "button",
}: IProps): JSX.Element => {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={children}
      className={className}
    >
      {children}
    </button>
  );
};

export default ButtonPlain;
