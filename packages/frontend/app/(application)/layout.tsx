import { FC } from 'react';

import '$assets/tailwind.css';
import { Layout } from '$layouts/layout/layout';
import { ChildrenProp } from 'src/types/children-prop';

const ApplicationLayout: FC<ChildrenProp> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default ApplicationLayout;
