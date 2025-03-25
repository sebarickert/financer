'use client';

import { Metadata } from 'next';

import { ContentHeader } from '@/layouts/ContentHeader';
import { Error as ErrorPageComponent } from '@/views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

export default function ErrorPage() {
  return (
    <>
      <ContentHeader title="Error" />
      <ErrorPageComponent errorPageType="in-app" />
    </>
  );
}
