'use client';

import { Metadata } from 'next';
import { FC } from 'react';

import { ErrorPage as ErrorPageComponent } from '$pages/error-page/error-page';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage: FC = () => <ErrorPageComponent errorPageType="in-app" />;

export default ErrorPage;
