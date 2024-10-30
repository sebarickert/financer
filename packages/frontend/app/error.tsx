'use client';

import { Metadata } from 'next';

import { Error as ErrorPageComponent } from '$views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage = () => <ErrorPageComponent errorPageType="full-app" />;

export default ErrorPage;
