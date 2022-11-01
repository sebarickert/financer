import { clsx } from 'clsx';
import React, { Children, cloneElement } from 'react';

import { DescriptionListProps } from './description-list';

interface DescriptionListBodyProps {
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
  variant?: DescriptionListProps['variant'];
}

export const DescriptionListBody = ({
  children,
  testId,
  variant,
}: DescriptionListBodyProps): JSX.Element => {
  const isLargeCount = Children.toArray(children).filter(
    (child) => (child as React.ReactElement).props.isLarge
  ).length;

  return (
    <dl
      className={clsx('grid grid-cols-2 rounded-lg border', {
        'bg-gray-25': variant === 'gray',
        'bg-gray-900 text-white border-gray-900': variant === 'black',
        'bg-blue-financer text-white border-bg-financer': variant === 'brand',
      })}
      data-testid={testId}
    >
      {Children.map(children, (child, index) => {
        const childrenCount = Children.count(children);

        if ((child as React.ReactElement).type === React.Fragment) {
          return Children.map(
            (child as React.ReactElement).props.children,
            (fragmentChildren, fragmentChildIndex) => {
              const fragmentChildrenCount = Children.count(
                (child as React.ReactElement).props.children
              );

              const isEven = (fragmentChildIndex + 1) % 2 === 0;
              const isSecondRow = fragmentChildIndex + 1 > 2;
              const isTotalChildrenCountOdd = fragmentChildrenCount % 2 === 1;

              return (
                <section
                  className={clsx('p-6', {
                    'border-l': isEven,
                    'border-t': isSecondRow,
                    'last:col-span-full': isTotalChildrenCountOdd,
                  })}
                >
                  {cloneElement(fragmentChildren as React.ReactElement, {
                    variant,
                  })}
                </section>
              );
            }
          );
        }

        const isLarge = (child as React.ReactElement).props.isLarge;
        const countOfIsLargeBefore = Children.toArray(children)
          .slice(0, index)
          .filter(
            (currentChild) => (currentChild as React.ReactElement).props.isLarge
          ).length;

        const isEven = (index + 1 + countOfIsLargeBefore) % 2 === 0;
        const isSecondRow = index + 1 + countOfIsLargeBefore > 2;
        const isTotalChildrenCountOdd =
          (childrenCount + isLargeCount) % 2 === 1;

        return (
          child && (
            <section
              className={clsx('p-6', {
                'border-l': isEven && !isLarge,
                'border-t': isSecondRow || (isLarge && index > 0),
                'last:col-span-full': isTotalChildrenCountOdd,
                'col-span-full': isLarge,
                'border-gray-700': variant === 'black',
                'border-gray-200': variant === 'brand',
              })}
            >
              {cloneElement(child as React.ReactElement, { variant })}
            </section>
          )
        );
      })}
    </dl>
  );
};
