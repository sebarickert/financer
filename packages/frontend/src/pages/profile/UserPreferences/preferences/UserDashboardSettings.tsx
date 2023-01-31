import { useNavigate } from 'react-router-dom';

import { AccountTypeEnum } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { Checkbox } from '$elements/checkbox/checkbox';
import { CheckboxGroup } from '$elements/checkbox/checkbox.group';
import { Heading } from '$elements/heading/heading';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import {
  useUpdateUserDashboardSettings,
  useUserDashboardSettings,
} from '$hooks/profile/user-preference/useDashboardSettings';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

const allAccountTypes = Object.values(AccountTypeEnum);

export const UserDashboardSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: dashboardSettings, isLoading: isLoadingDefault } =
    useUserDashboardSettings();
  const [setDashboardSettings, { isLoading: isUpdating }] =
    useUpdateUserDashboardSettings();

  const { accountTypes } = dashboardSettings ?? {};

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await setDashboardSettings({
      accountTypes: allAccountTypes
        .map((type) => ({
          type,
          value: (
            event.target as unknown as {
              [key in AccountTypeEnum]: HTMLInputElement;
            }
          )[type].checked,
        }))
        .filter(({ value }) => value)
        .map(({ type }) => type),
    });

    navigate('/profile/user-preferences');
  };

  const isLoading = isLoadingDefault;

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Dashboard settings"
        backLink={'/profile/user-preferences'}
      />
      {isLoading ? (
        <Loader />
      ) : (
        <Form
          handleSubmit={handleSave}
          submitLabel="Save"
          formFooterBackLink="/profile/user-preferences"
        >
          <Heading className="mb-4">Account types for stats and graph</Heading>
          <CheckboxGroup testId="dashboard-account-checkboxes">
            {allAccountTypes.map((type) => (
              <Checkbox
                key={type}
                id={type}
                label={capitalize(type)}
                checked={accountTypes?.some((item) => item === type)}
              />
            ))}
          </CheckboxGroup>
        </Form>
      )}
    </>
  );
};
