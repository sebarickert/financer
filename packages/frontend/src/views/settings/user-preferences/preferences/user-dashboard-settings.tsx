'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { accountTypeLabelMapping } from '$constants/account/accountTypeMapping';
import { settingsPaths } from '$constants/settings-paths';
import { Checkbox } from '$elements/checkbox/checkbox';
import { CheckboxGroup } from '$elements/checkbox/checkbox.group';
import { Heading } from '$elements/Heading';
import { Paragraph } from '$elements/paragraph/paragraph';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { capitalize } from '$utils/capitalize';

const allAccountTypes = Object.values(AccountType);

export interface UserDashboardSettingsFormFields {
  accountTypes: AccountType[];
}

interface UserDashboardSettingsProps {
  data?: UserDashboardSettingsFormFields;
  onSave: DefaultFormActionHandler;
}

export const UserDashboardSettings: FC<UserDashboardSettingsProps> = ({
  data,
  onSave,
}) => {
  const action = useFinancerFormState('user-dashboard-settings', onSave);
  const methods = useForm<UserDashboardSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.userPreferences} />
      <Form
        methods={methods}
        action={action}
        submitLabel="Save"
        formFooterBackLink={settingsPaths.userPreferences}
      >
        <section className="mb-4">
          <Heading>Account types</Heading>
          <Paragraph>
            Selected types will be calculated into statistics and graphs on the
            dashboard.
          </Paragraph>
        </section>
        <CheckboxGroup testId="dashboard-account-checkboxes" className="-mx-4">
          {allAccountTypes.map((type) => (
            <Checkbox
              key={type}
              id={type}
              value={type}
              label={capitalize(accountTypeLabelMapping[type])}
              name={'accountTypes'}
            />
          ))}
        </CheckboxGroup>
      </Form>
    </>
  );
};
