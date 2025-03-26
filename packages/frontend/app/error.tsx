'use client';

import clsx from 'clsx';
import { Metadata } from 'next';

import { ContentHeader } from '@/layouts/ContentHeader';
import { Error as ErrorPageComponent } from '@/views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

export default function ErrorPage() {
  return (
    <main
      className={clsx(
        'pt-6 lg:pt-12 pb-safe-offset-12 px-4 lg:px-8',
        'mx-auto max-w-screen-xl',
        'mt-(--gutter-top)',
      )}
    >
      <ContentHeader title="Error" />
      <ErrorPageComponent errorPageType="full-app" />
    </main>
  );
}
