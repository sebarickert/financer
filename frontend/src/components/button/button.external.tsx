import React from "react";

interface IProps {
  children: string;
  className: string;
  link: string;
}

const ButtonExternal = ({ children, className, link }: IProps): JSX.Element => {
  return (
    <a href={link} aria-label={children} className={className}>
      {children}
    </a>
  );
};

export default ButtonExternal;
