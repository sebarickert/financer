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

export type UserStatisticsPageSettingsFormFields = {
  accountTypes: AccountType[];
};

type UserStatisticsPageSettingsFormProps = {
  data?: UserStatisticsPageSettingsFormFields;
  onSave: DefaultFormActionHandler;
};

export const UserStatisticsPageSettingsForm: FC<
  UserStatisticsPageSettingsFormProps
> = ({ data, onSave }) => {
  const action = useFinancerFormState('user-statistics-page-settings', onSave);
  const methods = useForm<UserStatisticsPageSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <Form
      methods={methods}
      action={action}
      submitLabel="Save Changes"
      formFooterBackLink={settingsPaths.userPreferences}
      testId="statistics-page-settings-form"
      className="@container"
    >
      <fieldset className={'grid gap-2 @[600px]:grid-cols-2'}>
        {allAccountTypes.map((type) => (
          <InputOption
            key={type}
            id={'accountTypes'}
            value={type}
            type="checkbox"
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
