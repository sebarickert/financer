import { useRouter } from 'next/router';

import {
  useUserDefaultMarketUpdateSettings,
  useUpdateUserDefaultMarketUpdateSettings,
} from '$hooks/profile/user-preference/useDefaultMarketUpdateSettings';
import { useAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useAllTransactionCategories';
import {
  UserDefaultMarketUpdateSettings,
  UserDefaultMarketUpdateSettingsFormFields,
} from '$pages/profile/user-preferences/preferences/user-default-market-update-settings';

export const MarketUpdateSettingsContainer = () => {
  const { push } = useRouter();
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

    push('/profile/user-preferences');
  };

  return (
    <UserDefaultMarketUpdateSettings
      data={data}
      isLoading={isLoadingDefault}
      isUpdating={isUpdating}
      categories={categories}
      onSave={handleSave}
    />
  );
};
