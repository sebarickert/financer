'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { FC, Fragment } from 'react';

import { Link } from '@/elements/Link';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

export const Breadcrumbs: FC<{
  currentPageTitle: string;
  className?: string;
  breadcrumbOverrides?: Record<string, string>;
}> = ({ currentPageTitle, className, breadcrumbOverrides }) => {
  const breadcrumbs = useBreadcrumbs().slice(0, -1);

  if (!breadcrumbs.length) return null;

  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumbs"
      className={clsx(className)}
    >
      <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
        {breadcrumbs.map((crumb) => {
          const title = breadcrumbOverrides?.[crumb.href] ?? crumb.title;

          const modifiedCrumb = {
            ...crumb,
            title,
          };

          return (
            <Fragment key={modifiedCrumb.href}>
              <Breadcrumb {...modifiedCrumb} />
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
        <Breadcrumb title={currentPageTitle} isCurrentPage />
      </ol>
    </nav>
  );
};

const Breadcrumb: FC<{
  href?: string;
  title: string;
  isCurrentPage?: boolean;
}> = ({ href, title, isCurrentPage }) => {
  const url = href ?? '';

  return (
    <li className="inline-flex items-center gap-1.5">
      {isCurrentPage ? (
        <span
          aria-disabled="true"
          role="link"
          aria-current="page"
          className="text-foreground"
        >
          {title}
        </span>
      ) : (
        <Link
          className="text-muted-foreground hover:text-foreground!"
          href={url}
        >
          {title}
        </Link>
      )}
    </li>
  );
};

const BreadcrumbSeparator = () => {
  return (
    <li role="presentation" aria-hidden="true" className="[&>svg]:size-3.5">
      <ChevronRight />
    </li>
  );
};
