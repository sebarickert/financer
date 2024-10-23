import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

interface ListProps {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
}

export const List: FC<ListProps> = ({
  label,
  children,
  className,
  testId: rawTestId,
}) => {
  const testId = rawTestId ?? 'list';

  return (
    <section className={clsx(className)} data-testid={testId}>
      {label && <Heading testId={`${testId}-heading`}>{label}</Heading>}
      <ul className="space-y-0.5">
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                data-testid={testId}
                className={clsx(
                  'first:rounded-t-md last:rounded-b-md overflow-hidden',
                  'focus-within:theme-focus-without-prefix focus-within:z-10 focus-within:relative',
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
