import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';

import {
  ContextualNavigation,
  ContextualNavigationItem,
} from '$blocks/ContextualNavigation';
import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';

type ContentHeaderProps = {
  title: string;
  backLink?: string;
  headerAction?: React.ReactNode;
  contextualNavigationItems?: ContextualNavigationItem[];
};

export const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  backLink,
  headerAction,
  contextualNavigationItems,
}) => {
  console.log(contextualNavigationItems);

  return (
    <header
      className={clsx(
        'vt-name-[content-header]',
        'max-lg:bg-layer max-lg:border-b',
        'max-lg:fixed max-lg:inset-x-0 max-lg:top-0 z-[100]',
        'max-lg:text-center max-lg:px-1 max-lg:h-14',
        'grid items-center grid-cols-[48px_1fr_48px] grid-rows-[calc(var(--spacing)*12)_auto]',
        'lg:gap-x-4 lg:mb-6',
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
        {title}
      </Heading>
      {headerAction}
      {!!contextualNavigationItems?.length && (
        <ContextualNavigation
          items={contextualNavigationItems}
          className="grid-rows-[2] col-span-full max-lg:hidden"
        />
      )}
    </header>
  );
};
