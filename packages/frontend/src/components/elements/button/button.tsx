import clsx from 'clsx';
import { HTMLAttributes } from 'react';

import { Link } from '$elements/link/link';
import { isExternalLink } from '$utils/isExternalLink';
import { TransitionType } from '$utils/transitionAnimations';

export type ButtonAccentColor = 'blue' | 'plain' | 'black' | 'red' | 'unstyled';
interface ButtonProps
  extends Pick<
    HTMLAttributes<unknown>,
    'popoverTarget' | 'popoverTargetAction'
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
}

export const Button = ({
  accentColor = 'black',
  children,
  className = '',
  href,
  transition,
  onClick,
  type = 'button',
  testId,
  isDisabled,
  applyBaseStyles = true,
  popoverTarget,
  popoverTargetAction,
  ...props
}: ButtonProps): JSX.Element => {
  const buttonClasses = clsx({
    ['inline-flex justify-center w-full sm:w-auto rounded-md items-center py-3 px-6 focus:ring-2 focus:ring-offset-2 focus:outline-none transition ease-in-out duration-150 tracking-tight font-normal text-base hover:opacity-75 focus:opacity-75']:
      applyBaseStyles,
    ['bg-charcoal text-white focus:ring-charcoal']: accentColor === 'black',
    ['bg-blue text-white focus:ring-blue']: accentColor === 'blue',
    ['bg-red text-white focus:ring-red']: accentColor === 'red',
    ['bg-gray text-black focus:ring-charcoal hover:bg-gray-dark border border-gray-dark focus:opacity-100 hover:opacity-100']:
      accentColor === 'plain',
    ['']: accentColor === 'unstyled',
    [className]: true,
  });

  if (typeof href === 'string' && href.length > 0 && !isDisabled) {
    if (isExternalLink(href)) {
      return (
        <a
          href={href}
          className={buttonClasses}
          onClick={onClick}
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
      onClick={onClick}
      className={clsx(
        buttonClasses,
        'disabled:cursor-not-allowed disabled:text-opacity-25',
      )}
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
