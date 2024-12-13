import { Loader } from '$elements/Loader';
import { SettingsLayout } from '$features/settings/SettingsLayout';

export default function Loading() {
  return (
    <SettingsLayout title="Categories" isLoading>
      <Loader />
    </SettingsLayout>
  );
}
