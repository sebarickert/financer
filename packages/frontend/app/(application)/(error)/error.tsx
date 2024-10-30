'use client';

import { Metadata } from 'next';
import { FC } from 'react';

import { Error as ErrorPageComponent } from '$views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage: FC = () => <ErrorPageComponent errorPageType="in-app" />;

export default ErrorPage;
