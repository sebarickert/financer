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
  useUpdateUserStatisticsSettings,
  useUserStatisticsSettings,
} from '$hooks/profile/user-preference/useStatisticsSettings';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

const allAccountTypes = Object.values(AccountTypeEnum);

export interface UserStatisticsSettingsFormFields {
  accountTypes: AccountTypeEnum[];
}

export const UserStatisticsSettings = (): JSX.Element | null => {
  const methods = useForm<UserStatisticsSettingsFormFields>();

  const navigate = useNavigate();
  const { data, isLoading: isLoadingDefault } = useUserStatisticsSettings();
  const [setStatisticsSettings, { isLoading: isUpdating }] =
    useUpdateUserStatisticsSettings();

  const handleSave = async (
    newUserStatisticsData: UserStatisticsSettingsFormFields
  ) => {
    await setStatisticsSettings({
      accountTypes: newUserStatisticsData.accountTypes,
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
        title="Statistics settings"
        backLink={'/profile/user-preferences'}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={handleSave}
          submitLabel="Save"
          formFooterBackLink="/profile/user-preferences"
        >
          <Heading className="mb-4">Account types for stats and graph</Heading>
          <CheckboxGroup testId="statistics-account-checkboxes">
            {allAccountTypes.map((type) => (
              <Checkbox
                key={type}
                id={type}
                label={capitalize(type)}
                value={type}
                name="accountTypes"
              />
            ))}
          </CheckboxGroup>
        </Form>
      )}
    </>
  );
};
