import React from 'react';
import { Link } from 'react-router-dom';

interface IButtonInternalProps {
  children: string;
  className: string;
  link: string;
  onClick?(): void;
  testId?: string;
}

export const ButtonInternal = ({
  children,
  className,
  link,
  onClick,
  testId,
}: IButtonInternalProps): JSX.Element => {
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
