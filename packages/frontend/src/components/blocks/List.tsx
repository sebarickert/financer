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

  const stickyHeaderStyles = clsx(
    'sticky top-[--gutter-top] z-10',
    'bg-background/75 backdrop-blur-sm',
    'px-4 -mx-4',
    'max-lg:py-1 max-lg:-mt-1',
    'lg:pt-4 lg:pb-2 lg:-mt-4',
  );

  return (
    <section className={clsx(className)} data-testid={testId}>
      {label && (
        <div
          className={clsx({
            [stickyHeaderStyles]: hasStickyHeader,
          })}
          data-slot={hasStickyHeader ? 'list-sticky-header' : undefined}
        >
          <Heading testId={`${testId}-heading`} noMargin={!!hasStickyHeader}>
            {label}
          </Heading>
        </div>
      )}
      <ul
        className={clsx('grid gap-1 isolate', {
          'lg:grid-cols-2': columns === 2,
          'lg:grid-cols-3': columns === 3,
          'max-lg:pt-3 lg:pt-2': hasStickyHeader,
        })}
      >
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                data-testid={`${testId}-item`}
                className={clsx(
                  'focus-within:focus-highlight focus-within:z-10 focus-within:relative overflow-hidden',
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
