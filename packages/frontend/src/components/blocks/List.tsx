import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

type ListProps = {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
  columns?: 1 | 2 | 3;
  hasItemRoundness?: boolean;
  hasStickyHeader?: boolean;
};

export const List: FC<ListProps> = ({
  label,
  children,
  className,
  testId: rawTestId,
  columns = 1,
  hasItemRoundness,
  hasStickyHeader,
}) => {
  const testId = rawTestId ?? 'list';

  return (
    <section className={clsx(className)} data-testid={testId}>
      <div
        className={clsx({
          ['sticky top-[48px] lg:top-[64px] theme-bg-color z-10 py-4 -mt-4']:
            hasStickyHeader, // 48/64px is the height of the header
        })}
      >
        {label && (
          <Heading testId={`${testId}-heading`} noMargin={!!hasStickyHeader}>
            {label}
          </Heading>
        )}
      </div>
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
                data-testid={`${testId}-item`}
                className={clsx(
                  'focus-within:theme-focus-without-prefix focus-within:z-10 focus-within:relative overflow-hidden',
                  { 'rounded-md': hasItemRoundness },
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
