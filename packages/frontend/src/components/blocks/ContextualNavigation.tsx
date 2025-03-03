import clsx from 'clsx';
import { FC } from 'react';

import { Link } from '@/elements/Link';
import { Container } from '@/layouts/Container';

export interface ContextualNavigationItem {
  label: string;
  url: string;
  isExact?: boolean;
}

interface ContextualNavigationProps {
  items: ContextualNavigationItem[];
  className?: string;
}

export const ContextualNavigation: FC<ContextualNavigationProps> = ({
  items,
  className,
}) => {
  return (
    <nav data-slot="contextual-navigation" className={clsx(className)}>
      <Container className={clsx('')}>
        <ul className={clsx('flex items-center gap-6')}>
          {items.map((item) => (
            <li key={item.url} className="shrink-0">
              <Link
                href={item.url}
                className={clsx(
                  'inline-block text-sm py-3 relative',
                  'text-muted-foreground hover:text-foreground active:text-foreground aria-[current=page]:text-foreground transition-colors',
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
