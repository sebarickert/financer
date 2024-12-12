import clsx from 'clsx';
import { FC } from 'react';

import { Link } from '$elements/Link';
import { Container } from '$layouts/Container';

export type ContextualNavigationItem = {
  label: string;
  url: string;
  isExact?: boolean;
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
        'fixed left-0 right-0 top-(--gutter-top)',
        'bg-layer/85 backdrop-blur',
        'shadow-[inset_0_-1px] shadow-accent',
        'vt-name-[contextual-navigation]',
      )}
    >
      <Container className={clsx('')}>
        <ul
          className={clsx(
            'h-(--contextual-navigation-height) px-4 lg:px-8',
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
                  'text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground transition-colors',
                  'after:hidden aria-[current=page]:after:block',
                  'after:absolute after:h-0.5 after:-bottom-[3px] after:-left-2 after:-right-2 after:bg-blue',
                  !item.isExact &&
                    '[&[data-active-sub-page="true"]]:text-foreground [&[data-active-sub-page="true"]]:after:block',
                )}
                hasHoverEffect={false}
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
