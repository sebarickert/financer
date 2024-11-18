import clsx from 'clsx';
import { FC } from 'react';

import { Link } from '$elements/Link';
import { Container } from '$layouts/Container';

export type ContextualNavigationItem = {
  label: string;
  url: string;
};

type ContextualNavigationProps = {
  items: ContextualNavigationItem[];
};

export const ContextualNavigation: FC<ContextualNavigationProps> = ({
  items,
}) => {
  return (
    <nav
      data-slot="contextual-navigation"
      className={clsx(
        'z-[100] focus-within:z-[101]',
        'fixed left-0 right-0 top-[--gutter-top]',
        'bg-gray-100/75 dark:bg-[#1b1b1b]/75 backdrop-blur-sm',
        'shadow-[inset_0_-1px] shadow-gray-200 dark:shadow-[#2b2b2b]',
      )}
    >
      <Container className={clsx('')}>
        <ul
          className={clsx(
            'h-[--contextual-navigation-height] px-4 lg:px-8',
            'flex items-center gap-6',
            'overflow-y-scroll scroll-smooth [scrollbar-width:none]',
          )}
        >
          {items.map((item) => (
            <li key={item.url} className="shrink-0">
              <Link
                href={item.url}
                className={clsx(
                  'inline-block text-sm py-3 relative',
                  'after:hidden aria-[current=page]:after:block',
                  'after:absolute after:h-0.5 after:-bottom-[3px] after:left-0a after:right-0 after:w-full after:bg-blue-600',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
};
