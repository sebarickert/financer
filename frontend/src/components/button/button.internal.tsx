import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

const ButtonInternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: IProps): JSX.Element => {
  return (
    <Link
      to={link}
      aria-label={children}
      className={className}
      onClick={onClick}
      data-test-id={testId}
    >
      {children}
    </Link>
  );
};

export default ButtonInternal;
