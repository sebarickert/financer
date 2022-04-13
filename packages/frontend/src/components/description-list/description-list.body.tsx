import React, { Children } from 'react';

interface IDescriptionListBodyProps {
  children: React.ReactNode | React.ReactNode[];
  testId?: string;
}

export const DescriptionListBody = ({
  children,
  testId,
}: IDescriptionListBodyProps): JSX.Element => {
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
            (plaa, plaaIndex) => {
              const plaaChildrenCount = Children.count(
                (child as React.ReactElement).props.children
              );

              return (
                <section
                  className={`py-4 pl-6 pr-4 ${
                    (plaaIndex + 1) % 2 === 0 ? 'border-l' : ''
                  } ${plaaIndex + 1 > 2 ? 'border-t' : ''} ${
                    plaaChildrenCount % 2 === 1 ? 'last:col-span-full' : ''
                  }`}
                >
                  {plaa}
                </section>
              );
            }
          );
        }

        return (
          child && (
            <section
              className={`py-4 pl-6 pr-4 ${
                (index + 1) % 2 === 0 ? 'border-l' : ''
              } ${index + 1 > 2 ? 'border-t' : ''} ${
                childrenCount % 2 === 1 ? 'last:col-span-full' : ''
              }`}
            >
              {child}
            </section>
          )
        );
      })}
    </dl>
  );
};
