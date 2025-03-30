'use client';

import clsx from 'clsx';
import { FC, ReactNode } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Heading } from '@/elements/Heading';

export const ContentHeader: FC<{
  title: string;
  action?: ReactNode;
  breadcrumbOverrides?: Record<string, string>;
}> = ({ title, action, breadcrumbOverrides }) => {
  return (
    <header
      className={clsx(
        'vt-name-[content-header]',
        'mb-6',
        action && 'flex justify-between flex-wrap items-center',
      )}
    >
      <Breadcrumbs
        currentPageTitle={title}
        breadcrumbOverrides={breadcrumbOverrides}
        className="mb-4 w-full"
      />
      <Heading variant="h1" testId="page-main-heading" className="text-pretty">
        {title}
      </Heading>
      {action}
    </header>
  );
};
