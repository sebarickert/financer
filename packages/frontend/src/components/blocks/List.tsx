import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '$elements/Heading';

interface ListProps {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
  itemRoundness?: boolean;
}

export const List: FC<ListProps> = ({
  label,
  children,
  className,
  testId: rawTestId,
  itemRoundness = true,
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
                  itemRoundness && 'first:[&>:not(style)]:rounded-t-md',
                  itemRoundness && 'last:[&>:not(style)]:rounded-b-md',
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
