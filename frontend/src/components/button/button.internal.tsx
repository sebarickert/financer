import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  children: string;
  className: string;
  link: string;
}

const ButtonInternal = ({ children, className, link }: IProps): JSX.Element => {
  return (
    <Link to={link} aria-label={children} className={className}>
      {children}
    </Link>
  );
};

export default ButtonInternal;
