import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

export interface UserDashboardSettingsFormFields {
  accountTypes: AccountTypeEnum[];
}

export const UserDashboardSettings = (): JSX.Element | null => {
  const methods = useForm<UserDashboardSettingsFormFields>();
  const navigate = useNavigate();
  const { data, isLoading: isLoadingDefault } = useUserDashboardSettings();
  const [setDashboardSettings, { isLoading: isUpdating }] =
    useUpdateUserDashboardSettings();

  const handleSave = async (
    newUserDashboardData: UserDashboardSettingsFormFields
  ) => {
    await setDashboardSettings({
      accountTypes: newUserDashboardData.accountTypes,
    });

    navigate('/profile/user-preferences');
  };

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

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
          methods={methods}
          onSubmit={handleSave}
          submitLabel="Save"
          formFooterBackLink="/profile/user-preferences"
        >
          <Heading className="mb-4">Account types for stats and graph</Heading>
          <CheckboxGroup testId="dashboard-account-checkboxes">
            {allAccountTypes.map((type) => (
              <Checkbox
                key={type}
                id={type}
                value={type}
                label={capitalize(type)}
                name={'accountTypes'}
              />
            ))}
          </CheckboxGroup>
        </Form>
      )}
    </>
  );
};
