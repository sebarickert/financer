import { FC } from 'react';

import { LinkViewTransition } from '$elements/link/link-view-transition';
import { ViewTransition } from '$hooks/useViewTransitionRouter';

interface ButtonInternalProps {
  children: React.ReactNode;
  className: string;
  link: string;
  transition?: ViewTransition;
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
    <LinkViewTransition
      href={link}
      className={className}
      onClick={onClick}
      data-testid={testId}
      transition={transition}
    >
      {children}
    </LinkViewTransition>
  );
};
