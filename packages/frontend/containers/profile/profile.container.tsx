import { useUsersFindOwnUserQuery } from '$api/generated/financerApi';
import { Profile } from '$pages/profile/profile';

export const ProfileContainer = () => {
  const { data: profileInfo } = useUsersFindOwnUserQuery();

  return <Profile roles={profileInfo?.roles} />;
};
