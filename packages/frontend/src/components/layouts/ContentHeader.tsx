import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { FC } from 'react';

import { Button } from '$elements/Button/Button';
import { Heading } from '$elements/Heading';

type ContentHeaderProps = {
  title: string;
  backLink?: string;
  headerAction?: React.ReactNode;
};

export const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  backLink,
  headerAction,
}) => {
  return (
    <header
      className={clsx(
        'max-lg:bg-layer/85 max-lg:backdrop-blur max-lg:border-b',
        'max-lg:fixed max-lg:inset-x-0 max-lg:top-0',
        'max-lg:text-center max-lg:px-1 max-lg:h-14',
        'grid items-center grid-cols-[48px,1fr,48px] z-[100] relative',
        'lg:flex lg:gap-4 lg:mb-6',
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
        className="max-lg:justify-center max-lg:col-[2] lg:grow truncate"
        testId="page-main-heading"
      >
        {title}
      </Heading>
      {headerAction}
    </header>
  );
};
