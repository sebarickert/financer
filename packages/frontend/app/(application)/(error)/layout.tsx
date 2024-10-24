import { Metadata } from 'next';
import { FC } from 'react';

import { Layout } from '$layouts/Layout';
import { ChildrenProp } from 'src/types/children-prop';

export const metadata: Metadata = {
  title: 'Error',
};

const ErrorLayout: FC<ChildrenProp> = ({ children }) => (
  <Layout title="Error">{children} </Layout>
);

export default ErrorLayout;
