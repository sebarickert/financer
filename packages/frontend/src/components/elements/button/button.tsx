'use client';

import clsx from 'clsx';
import { HTMLAttributes, useCallback } from 'react';

import { Link } from '$elements/Link';
import { hapticRunner, HapticType } from '$utils/haptic.helper';
import { isExternalLink } from '$utils/isExternalLink';
import { TransitionType } from '$utils/transitionAnimations';

export type ButtonAccentColor = 'unstyled' | 'primary' | 'secondary' | 'danger';
interface ButtonProps
  extends Pick<
    HTMLAttributes<unknown>,
    'popoverTarget' | 'popoverTargetAction' | 'id'
  > {
  accentColor?: ButtonAccentColor;
  children: React.ReactNode;
  className?: string;
  href?: string;
  transition?: TransitionType;
  onClick?(): void;
  type?: 'button' | 'submit' | 'reset';
  testId?: string;
  isDisabled?: boolean;
  applyBaseStyles?: boolean;
  size?: 'small' | 'default' | 'icon';
  /** defaults to `none` */
  haptic?: HapticType;
}

export const buttonStyles = {
  base: clsx(
    'theme-focus ring-offset-2 dark:ring-offset-0 rounded-md w-full text-center sm:w-fit whitespace-nowrap',
    'inline-flex items-center justify-center gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    'disabled:pointer-events-none disabled:opacity-50',
  ),
  default: clsx('py-2.5 h-11 px-[18px] text-base'),
  icon: clsx('size-11'),
};

export const Button = ({
  accentColor = 'primary',
  children,
  className,
  href,
  transition,
  onClick,
  type = 'button',
  testId,
  isDisabled,
  applyBaseStyles = true,
  popoverTarget,
  popoverTargetAction,
  size = 'default',
  haptic = 'none',
  ...props
}: ButtonProps): JSX.Element => {
  const buttonClasses = clsx(className, {
    [buttonStyles.base]: applyBaseStyles,
    [buttonStyles.default]: size === 'default' && accentColor !== 'unstyled',
    [buttonStyles.icon]: size === 'icon' && accentColor !== 'unstyled',
    ['py-2.5 px-4 text-sm']: size === 'small' && accentColor !== 'unstyled',
    ['theme-button-primary']: accentColor === 'primary',
    ['theme-button-secondary']: accentColor === 'secondary',
    ['theme-button-danger']: accentColor === 'danger',
    ['']: accentColor === 'unstyled',
  });

  const onClickWithHaptic = useCallback(() => {
    hapticRunner(haptic);

    onClick?.();
  }, [haptic, onClick]);

  if (typeof href === 'string' && href.length > 0 && !isDisabled) {
    if (isExternalLink(href)) {
      return (
        <a
          href={href}
          className={buttonClasses}
          onClick={() => onClickWithHaptic()}
          data-testid={testId}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={buttonClasses}
        onClick={onClick}
        haptic={haptic}
        testId={testId}
        transition={transition}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={() => onClickWithHaptic()}
      className={buttonClasses}
      data-testid={testId}
      disabled={isDisabled}
      // @ts-expect-error popovertarget is not a valid prop
      popovertarget={popoverTarget}
      popovertargetaction={popoverTargetAction}
      {...props}
    >
      {children}
    </button>
  );
};
