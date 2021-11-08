import React from 'react';

interface IBannerProps {
  className?: string;
  accentColor?: 'black' | 'blue';
  headindType?: 'h1' | 'h2';
  title: string;
  children: React.ReactNode;
  testId?: string;
}

export const Banner = ({
  className = '',
  accentColor = 'black',
  headindType = 'h2',
  title,
  children,
  testId,
}: IBannerProps): JSX.Element => {
  const HeadingType = headindType;

  return (
    <div
      className={`-mt-6 -mx-4 pt-16 pb-12 px-6 lg:rounded-lg lg:mt-0 lg:mx-0 lg:p-6 ${
        accentColor === 'black' && 'bg-black-off'
      } ${
        accentColor === 'blue' && 'bg-blue-financer'
      } text-white space-y-4 ${className}`}
      data-testId={testId}
    >
      <HeadingType
        className="text-3xl font-extrabold sm:text-4xl"
        data-testId="banner-title"
      >
        {title}
      </HeadingType>
      <div
        className={`${accentColor === 'black' && 'text-gray-300'} ${
          accentColor === 'blue' && 'text-white'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
