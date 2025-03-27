import clsx from 'clsx';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { FC } from 'react';

import {
  ContextualNavigation,
  ContextualNavigationItem,
} from '@/blocks/ContextualNavigation';
import { Drawer } from '@/blocks/Drawer';
import { Button } from '@/elements/Button/Button';
import { Heading } from '@/elements/Heading';
import { Link } from '@/elements/Link';

interface ContentHeaderProps {
  title: string;
  backLink?: string;
  headerAction?: React.ReactNode;
  contextualNavigationItems?: ContextualNavigationItem[];
}

export const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  backLink,
  headerAction,
  contextualNavigationItems = [],
}) => {
  return (
    <>
      <header
        className={clsx(
          'vt-name-[content-header]',
          'max-lg:bg-layer max-lg:border-b',
          'max-lg:fixed max-lg:inset-x-0 max-lg:top-0',
          'max-lg:text-center max-lg:px-1 max-lg:h-14',
          'grid items-center grid-cols-[48px_1fr_48px]',
          'lg:gap-x-4 lg:mb-6 lg:grid-rows-[calc(var(--spacing)*12)_auto]',
          backLink && 'lg:grid-cols-[48px_1fr_48px]',
          !backLink && 'lg:grid-cols-[1fr_48px]',
        )}
      >
        {backLink && (
          <Button
            href={backLink}
            accentColor="secondary"
            size="icon"
            haptic="light"
            testId="header-back-link"
            transition="slideInFromLeft"
            className="max-lg:button-ghost"
          >
            <ArrowLeft />
            <span className="sr-only">Go back</span>
          </Button>
        )}
        <Heading
          variant="h1"
          testId="page-main-heading"
          className="max-lg:justify-center max-lg:col-[2] lg:grow truncate"
        >
          {Boolean(contextualNavigationItems?.length) && (
            <Button
              className="lg:hidden focus-visible:ring-inset gap-1!"
              accentColor="ghost"
              popoverTarget="mobile-contextual-navigation"
              popoverTargetAction="show"
              testId="contextual-navigation-button"
            >
              {title}
              <ChevronDown />
            </Button>
          )}
          <span
            className={clsx(
              Boolean(contextualNavigationItems?.length) && 'max-lg:hidden',
            )}
          >
            {title}
          </span>
        </Heading>
        {headerAction}
        {Boolean(contextualNavigationItems?.length) && (
          <ContextualNavigation
            items={contextualNavigationItems}
            className="max-lg:hidden lg:grid-rows-[2] lg:col-span-full"
          />
        )}
      </header>
      {Boolean(contextualNavigationItems?.length) && (
        <Drawer id="mobile-contextual-navigation" heading="Explore">
          <ul className={clsx('grid gap-1')}>
            {contextualNavigationItems.map((item) => (
              <li key={item.url}>
                <Link
                  href={item.url}
                  hasHoverEffect={false}
                  className={clsx(
                    'flex w-full py-3 px-3 h-12 rounded-md',
                    'items-center justify-between',
                    'transition-colors',
                    'text-muted-foreground hover:text-foreground active:text-foreground',
                    'aria-[current=page]:text-foreground aria-[current=page]:bg-accent aria-[current=page]:[&_svg]:hidden',
                    !item.isExact &&
                      '[&[data-active-sub-page="true"]]:text-foreground',
                  )}
                >
                  {item.label}
                  <ChevronRight />
                </Link>
              </li>
            ))}
          </ul>
        </Drawer>
      )}
    </>
  );
};
