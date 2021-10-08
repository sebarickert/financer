import React from 'react';

interface IButtonExternalProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

export const ButtonExternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: IButtonExternalProps): JSX.Element => {
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
