import { Children } from 'react';

import { Heading } from '../heading/heading';

import { LinkListRow } from './link-list.row';

interface LinkListProps {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  isVertical?: boolean;
}

export const LinkList = ({
  label,
  children,
  className = '',
  isVertical,
}: LinkListProps): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <Heading className="mb-2">{label}</Heading>}
      <ul
        className={`-mx-4 ${
          !isVertical ? 'lg:grid lg:grid-cols-2 lg:gap-0' : ''
        }`}
      >
        {Children.map(children, (child) => {
          return (
            child && (
              <LinkListRow key={`LinkListRow-${Math.random()}`}>
                {child}
              </LinkListRow>
            )
          );
        })}
      </ul>
    </section>
  );
};
