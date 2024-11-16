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
import { Paragraph } from '$elements/Paragraph';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { capitalize } from '$utils/capitalize';

const allAccountTypes = Object.values(AccountType);

export type UserDashboardSettingsFormFields = {
  accountTypes: AccountType[];
};

type UserDashboardSettingsFormProps = {
  data?: UserDashboardSettingsFormFields;
  onSave: DefaultFormActionHandler;
};

export const UserDashboardSettingsForm: FC<UserDashboardSettingsFormProps> = ({
  data,
  onSave,
}) => {
  const action = useFinancerFormState('user-dashboard-settings', onSave);
  const methods = useForm<UserDashboardSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <Form
      methods={methods}
      action={action}
      submitLabel="Save"
      formFooterBackLink={settingsPaths.userPreferences}
      testId="dashboard-settings-form"
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
  );
};
