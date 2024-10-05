import { FC } from 'react';

import { Link } from '$elements/link/link';
import { TransitionType } from '$utils/transitionAnimations';

interface ButtonInternalProps {
  children: React.ReactNode;
  className: string;
  link: string;
  transition?: TransitionType;
  onClick?(): void;
  testId?: string;
}

export const ButtonInternal: FC<ButtonInternalProps> = ({
  children,
  className,
  link,
  transition,
  onClick,
  testId,
}) => {
  return (
    <Link
      href={link}
      className={className}
      onClick={onClick}
      data-testid={testId}
      transition={transition}
    >
      {children}
    </Link>
  );
};
