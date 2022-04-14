import React, { Children } from 'react';

interface IDescriptionListBodyProps {
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
}

export const DescriptionListBody = ({
  children,
  testId,
}: IDescriptionListBodyProps): JSX.Element => {
  const isLargeCount = Children.toArray(children).filter(
    (child) => (child as React.ReactElement).props.isLarge
  ).length;

  return (
    <dl
      className="grid grid-cols-2 bg-gray-25 rounded-lg border"
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
                  className={`py-4 pl-6 pr-4 ${isEven ? 'border-l' : ''} ${
                    isSecondRow ? 'border-t' : ''
                  } ${isTotalChildrenCountOdd ? 'last:col-span-full' : ''}`}
                >
                  {fragmentChildren}
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
              className={`py-4 pl-6 pr-4 ${
                isEven && !isLarge ? 'border-l' : ''
              } ${isSecondRow || (isLarge && index > 0) ? 'border-t' : ''} ${
                isTotalChildrenCountOdd ? 'last:col-span-full' : ''
              } ${isLarge ? 'col-span-full' : ''}`}
            >
              {child}
            </section>
          )
        );
      })}
    </dl>
  );
};
