import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
}

const ButtonInternal = ({
  children,
  className,
  link,
  onClick,
}: IProps): JSX.Element => {
  return (
    <Link
      to={link}
      aria-label={children}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default ButtonInternal;
