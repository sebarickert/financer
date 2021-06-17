import React from "react";

interface IProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
}

const ButtonExternal = ({
  children,
  className,
  link,
  onClick,
}: IProps): JSX.Element => {
  return (
    <a
      href={link}
      aria-label={children}
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default ButtonExternal;
