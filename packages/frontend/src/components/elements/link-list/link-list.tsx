import { Children, FC } from 'react';

import { Heading } from '../heading/heading';

import { LinkListRow } from './link-list.row';

interface LinkListProps {
  label?: string;
  link?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  isVertical?: boolean;
  testId?: string;
}

export const LinkList: FC<LinkListProps> = ({
  label,
  link,
  children,
  className = '',
  isVertical,
  testId: rawTestId,
}) => {
  const testId = rawTestId ?? 'link-list';

  return (
    <section className={`${className}`} data-testid={testId}>
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
      <ul
        className={`-mx-4 ${
          !isVertical ? 'lg:grid lg:grid-cols-2 lg:gap-0' : ''
        }`}
      >
        {Children.map(children, (child) => {
          return (
            child && (
              <LinkListRow
                key={`LinkListRow-${Math.random()}`}
                testId={`${testId}-item`}
              >
                {child}
              </LinkListRow>
            )
          );
        })}
      </ul>
    </section>
  );
};
