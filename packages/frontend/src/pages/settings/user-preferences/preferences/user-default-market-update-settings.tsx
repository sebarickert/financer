import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Form } from '$blocks/form/form';
import { settingsPaths } from '$constants/settings-paths';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Select } from '$elements/select/select';
import { UserDefaultMarketUpdateSettings as UserDefaultMarketUpdateSettingsType } from '$hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { TransactionCategoryDtoWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface UserDefaultMarketUpdateSettingsFormFields {
  transactionDescription: string;
  category: string;
}

interface UserDefaultMarketUpdateSettingsProps {
  isLoading: boolean;
  isUpdating: boolean;
  categories: TransactionCategoryDtoWithCategoryTree[];
  data?: UserDefaultMarketUpdateSettingsType;
  onSave: (data: UserDefaultMarketUpdateSettingsFormFields) => void;
}

export const UserDefaultMarketUpdateSettings = ({
  isLoading,
  isUpdating,
  categories,
  data,
  onSave,
}: UserDefaultMarketUpdateSettingsProps): JSX.Element | null => {
  const methods = useForm<UserDefaultMarketUpdateSettingsFormFields>();

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Market update settings"
        backLink={settingsPaths.userPreferences}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={onSave}
          submitLabel="Save"
          formFooterBackLink="/profile/user-preferences"
        >
          <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
            <Input id="transactionDescription" isRequired>
              Transaction description
            </Input>
            <Select
              id="category"
              options={[{ name: 'None', _id: '' }, ...categories].map(
                ({ name, _id }) => ({
                  label: name,
                  value: _id,
                })
              )}
              isRequired
            >
              Category
            </Select>
          </div>
        </Form>
      )}
    </>
  );
};
