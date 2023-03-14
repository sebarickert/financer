import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Form } from '$blocks/form/form';
import { Input } from '$elements/input/input';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { Select } from '$elements/select/select';
import {
  useUpdateUserDefaultMarketUpdateSettings,
  useUserDefaultMarketUpdateSettings,
} from '$hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export interface UserDefaultMarketUpdateSettingsFormFields {
  transactionDescription: string;
  category: string;
}

export const UserDefaultMarketUpdateSettings = (): JSX.Element | null => {
  const methods = useForm<UserDefaultMarketUpdateSettingsFormFields>();

  const navigate = useNavigate();
  const { data, isLoading: isLoadingDefault } =
    useUserDefaultMarketUpdateSettings();
  const [setDefaultMarketUpdateSettings, { isLoading: isUpdating }] =
    useUpdateUserDefaultMarketUpdateSettings();

  const { data: categories = [] } =
    useAllTransactionCategoriesWithCategoryTree();

  const handleSave = async (
    newUserDefaultMarketUpdateData: UserDefaultMarketUpdateSettingsFormFields
  ) => {
    const { transactionDescription, category } = newUserDefaultMarketUpdateData;

    await setDefaultMarketUpdateSettings({
      transactionDescription,
      category,
    });

    navigate('/profile/user-preferences');
  };

  useEffect(() => {
    methods.reset(data);
  }, [data, methods]);

  const isLoading = isLoadingDefault;

  return (
    <>
      {isUpdating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Market update settings"
        backLink={'/profile/user-preferences'}
      />
      {isLoading && <Loader />}
      {!isLoading && (
        <Form
          methods={methods}
          onSubmit={handleSave}
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
