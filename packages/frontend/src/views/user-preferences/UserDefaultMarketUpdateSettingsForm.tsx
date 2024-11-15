'use client';

import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Input } from '$elements/input/input';
import { Select } from '$elements/Select';
import { TransactionCategoryDtoWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';
import {
  DefaultFormActionHandler,
  useFinancerFormState,
} from '$hooks/useFinancerFormState';
import { UserDefaultMarketUpdateSettings as UserDefaultMarketUpdateSettingsType } from '$ssr/api/user-preference.service';

export type UserDefaultMarketUpdateSettingsFormFields = {
  transactionDescription: string;
  category: string;
};

type UserDefaultMarketUpdateSettingsFormProps = {
  categories: TransactionCategoryDtoWithCategoryTree[];
  data?: UserDefaultMarketUpdateSettingsType;
  onSave: DefaultFormActionHandler;
};

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
      submitLabel="Save"
      formFooterBackLink={settingsPaths.userPreferences}
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
    </Form>
  );
};
