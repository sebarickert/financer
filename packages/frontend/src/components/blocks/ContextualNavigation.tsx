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
  className?: string;
};

export const ContextualNavigation: FC<ContextualNavigationProps> = ({
  items,
  className,
}) => {
  return (
    <nav
      data-slot="contextual-navigation"
      className={
        clsx(className)
        // 'z-[100] focus-within:z-[101]',
        // 'fixed left-0 right-0 top-(--gutter-top)',
        // 'bg-layer/85 backdrop-blur',
        // 'shadow-[inset_0_-1px] shadow-accent',
        // 'vt-name-[contextual-navigation]',
      }
    >
      <Container className={clsx('')}>
        <ul className={clsx('flex items-center gap-6')}>
          {items.map((item) => (
            <li key={item.url} className="shrink-0">
              <Link
                href={item.url}
                className={clsx(
                  'inline-block text-sm py-3 relative',
                  'text-muted-foreground hover:text-foreground aria-[current=page]:text-foreground transition-colors',
                  'after:hidden aria-[current=page]:after:block',
                  'after:absolute after:h-0.5 after:bottom-0 after:left-0 after:right-0 after:bg-blue',
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
