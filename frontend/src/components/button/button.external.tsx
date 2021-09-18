import React from "react";

interface IProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

const ButtonExternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: IProps): JSX.Element => {
  return (
    <a
      href={link}
      aria-label={children}
      className={className}
      onClick={onClick}
      data-test-id={testId}
    >
      {children}
    </a>
  );
};

export default ButtonExternal;
