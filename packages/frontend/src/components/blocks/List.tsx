import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

type ListProps = {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
  isHorizontal?: boolean;
};

export const List: FC<ListProps> = ({
  label,
  children,
  className,
  testId: rawTestId,
  isHorizontal,
}) => {
  const testId = rawTestId ?? 'list';
  const childrenCount = Children.count(children);

  return (
    <section className={clsx(className)} data-testid={testId}>
      {label && <Heading testId={`${testId}-heading`}>{label}</Heading>}
      <ul className={clsx('grid gap-1', { ['lg:grid-cols-2']: isHorizontal })}>
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                data-testid={testId}
                className={clsx(
                  'focus-within:theme-focus-without-prefix focus-within:z-10 focus-within:relative overflow-hidden',
                  {
                    ['first:rounded-t-md last:rounded-b-md']: !isHorizontal,
                    ['max-lg:first:rounded-t-md max-lg:last:rounded-b-md']:
                      isHorizontal,
                    ['rounded-md']: isHorizontal && childrenCount === 1,
                    ['lg:first:rounded-s-md lg:last:rounded-e-md']:
                      isHorizontal && childrenCount === 2,
                    ['lg:first:rounded-tl-md lg:[&:nth-child(2)]:rounded-tr-md']:
                      isHorizontal && childrenCount >= 2,
                    ['lg:[&:nth-last-child(2)]:rounded-bl-md lg:last:rounded-br-md']:
                      isHorizontal &&
                      childrenCount > 2 &&
                      childrenCount % 2 === 0,
                    ['lg:last:rounded-bl-md']:
                      isHorizontal &&
                      childrenCount > 2 &&
                      childrenCount % 2 !== 0,
                  },
                )}
              >
                {child}
              </li>
            )
          );
        })}
      </ul>
    </section>
  );
};
