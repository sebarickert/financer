'use client';

import { Metadata } from 'next';

import { Layout } from '@/layouts/Layout';
import { Error as ErrorPageComponent } from '@/views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage = () => (
  <Layout title="Error">
    <ErrorPageComponent errorPageType="full-app" />
  </Layout>
);

export default ErrorPage;
