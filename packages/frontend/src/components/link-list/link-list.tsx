import { Children } from 'react';

import { Heading } from '../heading/heading';

import { LinkListRow } from './link-list.row';

export const LinkList = ({
  label,
  children,
  className = '',
}: {
  label?: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}): JSX.Element => {
  return (
    <section className={`${className}`}>
      {label && <Heading className="mb-2">{label}</Heading>}
      <ul className="-mx-4">
        {Children.map(children, (child) => (
          <LinkListRow key={`LinkListRow-${Math.random()}`}>
            {child}
          </LinkListRow>
        ))}
      </ul>
    </section>
  );
};
