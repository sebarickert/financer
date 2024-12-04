'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { Button } from '$elements/Button/Button';
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
            Icon={ACCOUNT_TYPE_MAPPING[type].Icon}
            register={methods.register('accountTypes')}
          >
            {ACCOUNT_TYPE_MAPPING[type].label}
          </InputOption>
        ))}
      </fieldset>
      <Form.Footer>
        <Button type="submit">Save Changes</Button>
      </Form.Footer>
    </Form>
  );
};
