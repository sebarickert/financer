import { settingsPaths } from '$constants/settings-paths';
import {
  useUserDefaultMarketUpdateSettings,
  useUpdateUserDefaultMarketUpdateSettings,
} from '$hooks/settings/user-preference/useDefaultMarketUpdateSettings';
import { useGetAllTransactionCategoriesWithCategoryTree } from '$hooks/transactionCategories/useGetAllTransactionCategoriesWithCategoryTree';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import {
  UserDefaultMarketUpdateSettings,
  UserDefaultMarketUpdateSettingsFormFields,
} from '$pages/settings/user-preferences/preferences/user-default-market-update-settings';

export const MarketUpdateSettingsContainer = () => {
  const { push } = useViewTransitionRouter();
  const { data } = useUserDefaultMarketUpdateSettings();
  const [setDefaultMarketUpdateSettings] =
    useUpdateUserDefaultMarketUpdateSettings();

  const { data: categories = [] } =
    useGetAllTransactionCategoriesWithCategoryTree();

  const handleSave = async (
    newUserDefaultMarketUpdateData: UserDefaultMarketUpdateSettingsFormFields
  ) => {
    const { transactionDescription, category } = newUserDefaultMarketUpdateData;

    await setDefaultMarketUpdateSettings({
      transactionDescription,
      category,
    });

    push(settingsPaths.userPreferences);
  };

  return (
    <UserDefaultMarketUpdateSettings
      data={data}
      categories={categories}
      onSave={handleSave}
    />
  );
};
