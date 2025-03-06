import { Metadata } from 'next';
import { FC } from 'react';

import { OverwriteUserDataContainer } from '@/container/settings/OverwriteUserDataContainer';

export const metadata: Metadata = {
  title: 'Overwrite User Data (DANGER ZONE)',
};

const OverwriteUserDataPage: FC = () => {
  return <OverwriteUserDataContainer />;
};

export default OverwriteUserDataPage;
