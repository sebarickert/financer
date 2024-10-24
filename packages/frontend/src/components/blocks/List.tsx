import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

type ListProps = {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
  columns?: 1 | 2 | 3;
};

export const List: FC<ListProps> = ({
  label,
  children,
  className,
  testId: rawTestId,
  columns = 1,
}) => {
  const testId = rawTestId ?? 'list';

  return (
    <section className={clsx(className)} data-testid={testId}>
      {label && <Heading testId={`${testId}-heading`}>{label}</Heading>}
      <ul
        className={clsx('grid gap-1', {
          'lg:grid-cols-2': columns === 2,
          'lg:grid-cols-3': columns === 3,
        })}
      >
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                data-testid={testId}
                className={clsx(
                  'focus-within:theme-focus-without-prefix focus-within:z-10 focus-within:relative overflow-hidden',
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
