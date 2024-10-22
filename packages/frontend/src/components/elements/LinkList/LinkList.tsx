import clsx from 'clsx';
import { Children, FC } from 'react';

import { Heading } from '../heading/heading';

interface LinkListProps {
  label?: string;
  link?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  testId?: string;
}

export const LinkList: FC<LinkListProps> = ({
  label,
  link,
  children,
  className,
  testId: rawTestId,
}) => {
  const testId = rawTestId ?? 'link-list';

  return (
    <section className={clsx(className)} data-testid={testId}>
      {label && (
        <Heading
          className={'mb-2'}
          ctaLabel={`View '${label}'`}
          ctaUrl={link}
          ctaEntityTitle={label}
          testId={`${testId}-heading`}
        >
          {label}
        </Heading>
      )}
      <ul className="space-y-0.5">
        {Children.map(children, (child) => {
          return (
            child && (
              <li
                key={`LinkListRow-${Math.random()}`}
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
