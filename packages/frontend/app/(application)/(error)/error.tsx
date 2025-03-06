'use client';

import { Metadata } from 'next';
import { FC } from 'react';

import { Layout } from '@/layouts/Layout';
import { Error as ErrorPageComponent } from '@/views/Error';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorPage: FC = () => (
  <Layout title="Error">
    <ErrorPageComponent errorPageType="in-app" />
  </Layout>
);

export default ErrorPage;
