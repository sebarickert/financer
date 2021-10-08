import React from 'react';

import { Container } from '../container/container';

type AccentColor = 'pink' | 'red' | 'green' | 'blue';

interface IHeroProps {
  accent?: string;
  accentColor?: AccentColor;
  label: string;
  children: React.ReactNode;
  standAlone?: boolean;
  className?: string;
  testId?: string;
}

const getHeroColorClasses = (color: AccentColor): string => {
  switch (color) {
    case 'blue':
      return 'text-blue-500';
    case 'green':
      return 'text-green-500';
    case 'pink':
      return 'text-pink-500';
    case 'red':
      return 'text-red-500';
    default:
      return '';
  }
};

export const Hero = ({
  accent,
  accentColor = 'pink',
  label,
  children,
  standAlone,
  className = '',
  testId,
}: IHeroProps): JSX.Element => {
  const heroContent = (
    <div className="max-w-xl" data-test-id={testId}>
      <h1
        className={`text-4xl tracking-tight leading-10 font-extrabold ${
          standAlone ? 'text-gray-900' : 'text-white'
        } sm:leading-none sm:text-5xl`}
        data-test-id="hero-title"
      >
        {accent && (
          <>
            <span
              className={`text-2xl  leading-none ${getHeroColorClasses(
                accentColor
              )}`}
            >
              {accent}
            </span>
            <br />
          </>
        )}
        {label}
      </h1>
      {children}
    </div>
  );

  if (standAlone) {
    return <div className={className}>{heroContent}</div>;
  }

  return (
    <div className={`pt-8 pb-14 sm:pt-12 sm:pb-20 ${className} bg-gray-800`}>
      <Container>{heroContent}</Container>
    </div>
  );
};
