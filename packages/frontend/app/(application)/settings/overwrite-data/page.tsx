import { Metadata } from 'next';

import { handleOverwriteUserData } from '@/actions/user/handleOverwriteUserData';
import { settingsPaths } from '@/constants/settingsPaths';
import { ContentHeader } from '@/layouts/ContentHeader';
import { OverwriteUserData } from '@/views/OverwriteUserData';

export const metadata: Metadata = {
  title: 'Overwrite User Data (DANGER ZONE)',
};

export default function OverwriteUserDataPage() {
  return (
    <>
      <ContentHeader
        title="Overwrite User Data (DANGER ZONE)"
        backLink={settingsPaths.default}
      />
      <OverwriteUserData onOverwriteData={handleOverwriteUserData} />
    </>
  );
}
