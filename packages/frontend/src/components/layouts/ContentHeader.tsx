'use client';

import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Heading } from '@/elements/Heading';

export const ContentHeader: FC<{
  title: string;
  titleVtName?: string;
  action?: ReactNode;
  breadcrumbOverrides?: Record<string, string>;
}> = ({ title, action, breadcrumbOverrides, titleVtName }) => {
  return (
    <header
      className={clsx(
        'mb-6 relative',
        'grid grid-cols-[1fr_auto] gap-4 items-center',
      )}
    >
      <Breadcrumbs
        currentPageTitle={title}
        breadcrumbOverrides={breadcrumbOverrides}
        className="col-span-full"
      />
      <Heading
        variant="h1"
        testId="page-main-heading"
        className="truncate"
        vtName={titleVtName}
      >
        {title}
      </Heading>
      {action}
    </header>
  );
};
