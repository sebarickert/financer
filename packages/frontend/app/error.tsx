'use client';

import { Metadata } from 'next';

import { ErrorPage as ErrorPageComponent } from 'src/components/pages/error-page/error-page';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage = () => <ErrorPageComponent errorPageType="full-app" />;

export default ErrorPage;
