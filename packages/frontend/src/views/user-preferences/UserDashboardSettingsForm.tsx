'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/form/form';
import { accountTypeMapping } from '$constants/account/accountTypeMapping';
import { settingsPaths } from '$constants/settings-paths';
import { InputOption } from '$elements/InputOption';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

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
      submitLabel="Save Changes"
      formFooterBackLink={settingsPaths.userPreferences}
      testId="dashboard-settings-form"
      className="@container"
    >
      <fieldset className={'grid gap-2 @[600px]:grid-cols-2'}>
        <legend className="sr-only">Select Account Types</legend>
        {allAccountTypes.map((type) => (
          <InputOption
            key={type}
            id={'accountTypes'}
            type="checkbox"
            value={type}
            icon={accountTypeMapping[type].icon}
            register={methods.register('accountTypes')}
          >
            {accountTypeMapping[type].label}
          </InputOption>
        ))}
      </fieldset>
    </Form>
  );
};
