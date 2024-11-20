'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import {
  Link as TransitionLink,
  useTransitionRouter,
} from 'next-view-transitions';

import { hapticRunner, HapticType } from '$utils/haptic.helper';
import { isExternalLink } from '$utils/isExternalLink';
import {
  transitionAnimations,
  TransitionType,
} from '$utils/transitionAnimations';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  isAbsolute?: boolean;
  href: string;
  transition?: TransitionType;
  /** defaults to `none` */
  haptic?: HapticType;
  onClick?: () => void;
  hasHoverEffect?: boolean;
}

export const Link = ({
  className = '',
  children,
  testId,
  isAbsolute,
  href,
  transition,
  haptic = 'none',
  hasHoverEffect = true,
  ...props
}: LinkProps): JSX.Element => {
  const pathname = usePathname();
  const router = useTransitionRouter();

  const isCurrentPage = pathname === href;

  const linkClasses = clsx(
    'focus-visible:focus-highlight text-foreground',
    className,
    {
      'hover:text-muted-foreground': hasHoverEffect,
    },
  );
  const linkContent = (
    <>
      {isAbsolute && <span className="absolute inset-0" aria-hidden="true" />}
      {children}
    </>
  );

  if (isExternalLink(href)) {
    return (
      <a
        {...props}
        onClick={() => {
          hapticRunner(haptic);
          props.onClick?.();
        }}
        href={href}
        className={linkClasses}
        data-testid={testId}
      >
        {linkContent}
      </a>
    );
  }

  if (transition) {
    return (
      <a
        {...props}
        onClick={(e) => {
          hapticRunner(haptic);
          e.preventDefault();
          props.onClick?.();
          router.push(href, {
            onTransitionReady: transitionAnimations[transition],
          });
        }}
        href={href}
        className={linkClasses}
        data-testid={testId}
        aria-current={isCurrentPage ? 'page' : undefined}
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
      onClick={() => {
        hapticRunner(haptic);
        props.onClick?.();
      }}
      aria-current={isCurrentPage ? 'page' : undefined}
    >
      {linkContent}
    </TransitionLink>
  );
};
