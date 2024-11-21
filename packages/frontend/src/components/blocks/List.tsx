import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

type ListProps = {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
};

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
      <ul data-slot="list" className={clsx('grid divide-y', {})}>
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                data-slot="list-item"
                data-testid={`${testId}-item`}
                className={clsx(
                  '[&>*:focus-visible]:z-10 [&>*:focus-visible]:relative',
                  '[&:first-child>:first-child]:rounded-t-md',
                  '[&:last-child>:first-child]:rounded-b-md',
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
