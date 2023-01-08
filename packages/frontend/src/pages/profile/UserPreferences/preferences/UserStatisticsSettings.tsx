import { AccountType } from '@local/types';
import { useNavigate } from 'react-router-dom';

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

const allAccountTypes = Object.values(AccountType);

export const UserStatisticsSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: statisticsSettings, isLoading: isLoadingDefault } =
    useUserStatisticsSettings();
  const [setStatisticsSettings, { isLoading: isUpdating }] =
    useUpdateUserStatisticsSettings();

  const { accountTypes } = statisticsSettings ?? {};

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await setStatisticsSettings({
      accountTypes: allAccountTypes
        .map((type) => ({
          type,
          value: (
            event.target as unknown as {
              [key in AccountType]: HTMLInputElement;
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
        title="Statistics settings"
        backLink={'/profile/user-preferences'}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          handleSubmit={handleSave}
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
                checked={accountTypes?.some((item) => item === type)}
              />
            ))}
          </CheckboxGroup>
        </Form>
      )}
    </>
  );
};
