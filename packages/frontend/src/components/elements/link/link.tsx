'use client';

import clsx from 'clsx';
import {
  Link as TransitionLink,
  useTransitionRouter,
} from 'next-view-transitions';

import { isExternalLink } from '$utils/isExternalLink';
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
    console.log('external link', href);
    return (
      <a {...props} href={href} className={linkClasses} data-testid={testId}>
        {linkContent}
      </a>
    );
  }

  if (transition) {
    console.log('transition link', href);
    return (
      <a
        {...props}
        onClick={(e) => {
          e.preventDefault();
          props.onClick?.(e);
          router.push(href, {
            onTransitionReady: transitionAnimations[transition],
          });
        }}
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
