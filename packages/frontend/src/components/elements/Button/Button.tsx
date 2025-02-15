'use client';

import clsx from 'clsx';
import { FC, HTMLAttributes, type JSX, useCallback } from 'react';

import { Link } from '$elements/Link';
import { HapticType, hapticRunner } from '$utils/haptic.helper';
import { isExternalLink } from '$utils/isExternalLink';
import { TransitionType } from '$utils/transitionAnimations';

export type ButtonAccentColor =
  | 'unstyled'
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'ghost';
interface ButtonProps
  extends Pick<
    HTMLAttributes<unknown>,
    'popoverTarget' | 'popoverTargetAction' | 'id' | 'title'
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
  size?: 'default' | 'icon';
  /** Defaults to `none` */
  haptic?: HapticType;
}

export const Button: FC<ButtonProps> = ({
  accentColor = 'primary',
  children,
  className,
  href,
  transition,
  onClick,
  type = 'button',
  testId,
  isDisabled,
  popoverTarget,
  popoverTargetAction,
  size = 'default',
  haptic = 'none',
  ...props
}): JSX.Element => {
  const buttonStyles = {
    base: clsx(
      'focus-visible:focus-highlight whitespace-nowrap cursor-pointer',
      'inline-flex items-center justify-center [&:has(svg)]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      'disabled:pointer-events-none disabled:opacity-50',
    ),
    default: clsx('py-3 h-12 px-5'),
    icon: clsx('h-12 w-12'),
  };

  const buttonClasses = clsx(
    buttonStyles.base,
    {
      'text-base rounded-md text-center':
        (size === 'icon' || size === 'default') && accentColor !== 'unstyled',
      [buttonStyles.default]: size === 'default' && accentColor !== 'unstyled',
      [buttonStyles.icon]: size === 'icon' && accentColor !== 'unstyled',
      'button-primary': accentColor === 'primary',
      'button-secondary': accentColor === 'secondary',
      'button-danger': accentColor === 'danger',
      'button-ghost': accentColor === 'ghost',
      '': accentColor === 'unstyled',
    },
    className,
  );

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
          onClick={() => {
            onClickWithHaptic();
          }}
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
        hasHoverEffect={false}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={() => {
        onClickWithHaptic();
      }}
      className={buttonClasses}
      data-testid={testId}
      disabled={isDisabled}
      popoverTarget={popoverTarget}
      popoverTargetAction={popoverTargetAction}
      {...props}
    >
      {children}
    </button>
  );
};
