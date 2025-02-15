'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { AccountType } from '$api/generated/financerApi';
import { Form } from '$blocks/Form';
import { InfoMessageBlock } from '$blocks/InfoMessageBlock';
import { ACCOUNT_TYPE_MAPPING } from '$constants/account/ACCOUNT_TYPE_MAPPING';
import { Button } from '$elements/Button/Button';
import { Input } from '$elements/Input';
import { InputOption } from '$elements/InputOption';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';

const allAccountTypes = Object.values(AccountType);

export interface UserDashboardSettingsFormFields {
  accountTypes?: AccountType[];
  chunkSize: number;
}

interface UserDashboardSettingsFormProps {
  data?: UserDashboardSettingsFormFields;
  onSave: DefaultFormActionHandler;
}

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
      testId="dashboard-settings-form"
      className="@container grid gap-12"
    >
      <div>
        <InfoMessageBlock
          title="Account Types"
          className="mb-6"
          variant="barebone"
        >
          The selected account types will determine the calculated numbers and
          charts on your dashboard.
        </InfoMessageBlock>
        <fieldset className={'grid gap-2 @[600px]:grid-cols-2'}>
          <legend className="sr-only">Select Account Types</legend>
          {allAccountTypes.map((type) => (
            <InputOption
              key={type}
              id={'accountTypes'}
              type="checkbox"
              value={type}
              Icon={ACCOUNT_TYPE_MAPPING[type].Icon}
              register={methods.register('accountTypes')}
            >
              {ACCOUNT_TYPE_MAPPING[type].label}
            </InputOption>
          ))}
        </fieldset>
      </div>
      <div>
        <InfoMessageBlock
          title="Recent Activity Limit"
          className="mb-6"
          variant="barebone"
        >
          Specify the maximum number of transaction items to display in the
          Recent Activity section on your dashboard.
        </InfoMessageBlock>
        <Input id="chunkSize" type="number" min={3} step={1} max={100}>
          Amount
        </Input>
      </div>
      <Form.Footer className="!mt-0">
        <Button type="submit">Save Changes</Button>
      </Form.Footer>
    </Form>
  );
};
