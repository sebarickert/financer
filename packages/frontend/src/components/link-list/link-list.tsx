import { Children } from 'react';
import { NavLink } from 'react-router-dom';

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

export const LinkList = ({
  label,
  link,
  children,
  className = '',
  isVertical,
  testId,
}: LinkListProps): JSX.Element => {
  return (
    <section className={`${className}`} data-testid={testId}>
      {label && (
        <Heading className={`mb-2 ${link ? 'underline' : ''}`}>
          {link ? <NavLink to={link}>{label}</NavLink> : label}
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
