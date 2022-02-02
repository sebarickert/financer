import React from 'react';

import { ButtonExternal } from './button.external';
import { ButtonInternal } from './button.internal';
import { ButtonPlain } from './button.plain';

type AccentColor = 'red' | 'green' | 'blue' | 'plain';
interface IButtonProps {
  accentColor?: AccentColor;
  children: string;
  className?: string;
  link?: string;
  onClick?(): void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  testId?: string;
  isDisabled?: boolean;
}

export const isExternalLink = (link: string): boolean =>
  link.substr(0, 8) === 'https://' ||
  link.substr(0, 7) === 'http://' ||
  link.substr(0, 2) === '//' ||
  link.substr(0, 5) === 'blob:' ||
  link.substr(0, 5) === '/api/' ||
  link.substr(0, 6) === '/auth/';

const getButtonColorClasses = (color: AccentColor): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-financer hover:bg-blue-500 active:bg-blue-700 focus:ring-blue-500';
    case 'green':
      return 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500';
    case 'red':
      return 'bg-red-600 hover:bg-red-500 active:bg-red-700 focus:ring-red-500';
    default:
      return '';
  }
};

export const Button = ({
  accentColor = 'blue',
  children,
  className = '',
  link,
  onClick = () => {},
  type = 'button',
  testId,
  isDisabled,
}: IButtonProps): JSX.Element => {
  const elementClasses = [
    `inline-flex justify-center w-full sm:w-auto rounded-md items-center py-3 px-6 border font-medium text-base text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150 ${className}`,
  ];

  if (accentColor === 'plain') {
    elementClasses.push(
      `border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:ring-blue-500`
    );
  } else {
    elementClasses.push(
      `border-transparent ${getButtonColorClasses(accentColor)}`
    );
  }

  if (typeof link === 'string' && link.length > 0 && !isDisabled) {
    if (isExternalLink(link)) {
      return (
        <ButtonExternal
          link={link}
          className={elementClasses.join(' ')}
          onClick={onClick}
          testId={testId}
        >
          {children}
        </ButtonExternal>
      );
    }

    return (
      <ButtonInternal
        link={link}
        className={elementClasses.join(' ')}
        onClick={onClick}
        testId={testId}
      >
        {children}
      </ButtonInternal>
    );
  }

  return (
    <ButtonPlain
      type={type}
      onClick={onClick}
      className={elementClasses.join(' ')}
      testId={testId}
      isDisabled={isDisabled}
    >
      {children}
    </ButtonPlain>
  );
};
