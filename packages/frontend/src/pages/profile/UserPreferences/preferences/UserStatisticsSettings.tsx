import { AccountType } from '@local/types';
import { useNavigate } from 'react-router-dom';

import { Checkbox } from '../../../../components/checkbox/checkbox';
import { CheckboxGroup } from '../../../../components/checkbox/checkbox.group';
import { Form } from '../../../../components/form/form';
import { Heading } from '../../../../components/heading/heading';
import { UpdatePageInfo } from '../../../../components/seo/updatePageInfo';
import { useUserStatisticsSettings } from '../../../../hooks/profile/user-preference/useStatisticsSettings';
import { capitalize } from '../../../../utils/capitalize';

const allAccountTypes = Object.values(AccountType);

export const UserStatisticsSettings = (): JSX.Element => {
  const navigate = useNavigate();
  const [statisticsSettings, setStatisticsSettings] =
    useUserStatisticsSettings();

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

  return (
    <>
      <UpdatePageInfo
        title="Statistics settings"
        backLink={'/profile/user-preferences'}
      />
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
    </>
  );
};
