'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useTransitionRouter } from 'next-view-transitions';
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
}

export const Link = ({
  className = '',
  children,
  testId,
  isAbsolute,
  href,
  haptic = 'none',
  hasHoverEffect = true,
  ...props
}: LinkProps): JSX.Element => {
  const pathname = usePathname();
  const router = useTransitionRouter();

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

  return (
    <a
      {...props}
      onClick={(e) => {
        hapticRunner(haptic);
        e.preventDefault();
        props.onClick?.();
        router.push(href);
      }}
      href={href}
      className={linkClasses}
      data-testid={testId}
      aria-current={isCurrentPage ? 'page' : undefined}
      data-active-sub-page={hasActiveSubPage}
    >
      {linkContent}
    </a>
  );

  // TODO we should test if VT works as with native link
  // return (
  //   <TransitionLink
  //     {...props}
  //     href={href}
  //     className={linkClasses}
  //     data-testid={testId}
  //     onClick={() => {
  //       hapticRunner(haptic);
  //       props.onClick?.();
  //     }}
  //     aria-current={isCurrentPage ? 'page' : undefined}
  //     data-active-sub-page={hasActiveSubPage}
  //   >
  //     {linkContent}
  //   </TransitionLink>
  // );
};
