'use client';

import { Metadata } from 'next';
import { FC } from 'react';

import { Layout } from '$layouts/Layout';
import { ErrorPage as ErrorPageComponent } from '$pages/error-page/error-page';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage: FC = () => (
  <Layout title="Error">
    <ErrorPageComponent errorPageType="in-app" />
  </Layout>
);

export default ErrorPage;
