import { Metadata } from 'next';

import { handleOverwriteUserData } from '@/actions/user/handleOverwriteUserData';
import { ContentHeader } from '@/layouts/ContentHeader';
import { OverwriteUserData } from '@/views/OverwriteUserData';

export const metadata: Metadata = {
  title: 'Overwrite User Data (DANGER ZONE)',
};

export default function OverwriteUserDataPage() {
  return (
    <>
      <ContentHeader title="Overwrite User Data (DANGER ZONE)" />
      <OverwriteUserData onOverwriteData={handleOverwriteUserData} />
    </>
  );
}
