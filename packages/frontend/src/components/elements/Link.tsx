'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Link as TransitionLink } from 'next-view-transitions';
import type { JSX } from 'react';

import { HapticType, hapticRunner } from '@/utils/haptic.helper';
import { isExternalLink } from '@/utils/isExternalLink';

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  isAbsolute?: boolean;
  href: string;
  /** Defaults to `none` */
  haptic?: HapticType;
  onClick?: () => void;
  hasHoverEffect?: boolean;
  noTransition?: boolean;
  vtName?: string;
}

export const Link = ({
  className = '',
  children,
  testId,
  isAbsolute,
  noTransition,
  href,
  haptic = 'none',
  hasHoverEffect = true,
  vtName,
  ...props
}: LinkProps): JSX.Element => {
  const pathname = usePathname();

  const isCurrentPage = pathname === href;
  const hasActiveSubPage = href !== '/' && pathname.startsWith(href);

  const linkClasses = clsx(
    'focus-visible:focus-highlight text-foreground',
    className,
    hasHoverEffect &&
      'hover:text-muted-foreground active:text-muted-foreground',
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

  const LinkElement = noTransition ? NextLink : TransitionLink;

  return (
    <LinkElement
      {...props}
      href={href}
      className={linkClasses}
      data-testid={testId}
      onClick={() => {
        hapticRunner(haptic);
        props.onClick?.();
      }}
      aria-current={isCurrentPage ? 'page' : undefined}
      data-active-sub-page={hasActiveSubPage}
      data-vt={!!vtName}
      style={{
        '--vt-name': vtName,
      }}
    >
      {linkContent}
    </LinkElement>
  );
};
