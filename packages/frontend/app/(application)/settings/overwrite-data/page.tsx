import { Metadata } from 'next';

import { handleOverwriteUserData } from '@/actions/user/handleOverwriteUserData';
import { generateNavigationViewTransitionName } from '@/features/settings/generateNavigationViewTransitionName';
import { ContentHeader } from '@/layouts/ContentHeader';
import { OverwriteUserData } from '@/views/OverwriteUserData';

export const metadata: Metadata = {
  title: 'Overwrite User Data (DANGER ZONE)',
};

export default function OverwriteUserDataPage() {
  const vtNames = generateNavigationViewTransitionName();

  return (
    <>
      <ContentHeader
        title="Overwrite User Data (DANGER ZONE)"
        titleVtName={vtNames.overrideUserData}
      />
      <OverwriteUserData onOverwriteData={handleOverwriteUserData} />
    </>
  );
}
