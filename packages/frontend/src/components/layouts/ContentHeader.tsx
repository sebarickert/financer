import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';

import { ContextualNavigationItem } from '$blocks/ContextualNavigation';
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
        'max-lg:h-14 lg:h-12',
        'grid items-center',
        'lg:flex lg:gap-4 lg:mb-6',
        !backLink && 'grid-cols-[1fr_48px] max-lg:pl-4 max-lg:pr-1',
        backLink && 'grid-cols-[48px_1fr_48px] max-lg:text-center max-lg:px-1',
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
      <Heading variant="h1" testId="page-main-heading" className="lg:grow">
        {title}
      </Heading>
      {headerAction}
    </header>
  );
};
