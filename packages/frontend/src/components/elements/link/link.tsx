'use client';

import clsx from 'clsx';
import {
  Link as TransitionLink,
  useTransitionRouter,
} from 'next-view-transitions';

import { isExternalLink } from '$elements/button/is-external-link';
import {
  transitionAnimations,
  TransitionType,
} from '$utils/transitionAnimations';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  isAbsolute?: boolean;
  href: string;
  transition?: TransitionType;
}

export const Link = ({
  className = '',
  children,
  testId,
  isAbsolute,
  href,
  transition,
  ...props
}: LinkProps): JSX.Element => {
  const router = useTransitionRouter();

  const linkClasses = clsx('font-medium tracking-tight', {
    [className]: true,
  });
  const linkContent = (
    <>
      {isAbsolute && <span className="absolute inset-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (isExternalLink(href)) {
    return (
      <a {...props} href={href} className={linkClasses} data-testid={testId}>
        {linkContent}
      </a>
    );
  }

  if (transition) {
    return (
      <a
        onClick={(e) => {
          e.preventDefault();
          router.push(href, {
            onTransitionReady: transitionAnimations[transition],
          });
        }}
        {...props}
        href={href}
        className={linkClasses}
        data-testid={testId}
      >
        {linkContent}
      </a>
    );
  }

  return (
    <TransitionLink
      {...props}
      href={href}
      className={linkClasses}
      data-testid={testId}
    >
      {linkContent}
    </TransitionLink>
  );
};
