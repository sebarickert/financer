'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { UserDefaultMarketUpdateSettings as UserDefaultMarketUpdateSettingsType } from '@/api-service';
import { Form } from '@/blocks/Form';
import { Button } from '@/elements/Button/Button';
import { Input } from '@/elements/Input';
import { Select } from '@/elements/Select';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '@/hooks/useFinancerFormState';
import { TransactionCategoryDtoWithCategoryTree } from '@/types/TransactionCategoryDtoWithCategoryTree';

export interface UserDefaultMarketUpdateSettingsFormFields {
  transactionDescription: string;
  category: string;
}

interface UserDefaultMarketUpdateSettingsFormProps {
  categories: TransactionCategoryDtoWithCategoryTree[];
  data?: UserDefaultMarketUpdateSettingsType;
  onSave: DefaultFormActionHandler;
}

export const UserDefaultMarketUpdateSettingsForm: FC<
  UserDefaultMarketUpdateSettingsFormProps
> = ({ categories, data, onSave }) => {
  const action = useFinancerFormState(
    'user-default-market-update-settings',
    onSave,
  );
  const methods = useForm<UserDefaultMarketUpdateSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <Form
      methods={methods}
      action={action}
      testId="market-update-settings-form"
    >
      <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
        <Input id="transactionDescription" isRequired>
          Transaction description
        </Input>
        <Select
          id="category"
          options={[{ name: 'None', id: '' }, ...categories].map(
            ({ name, id }) => ({
              label: name,
              value: id,
            }),
          )}
          isRequired
        >
          Category
        </Select>
      </div>
      <Form.Footer>
        <Button type="submit">Save</Button>
      </Form.Footer>
    </Form>
  );
};
