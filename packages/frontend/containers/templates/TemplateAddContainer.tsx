import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { settingsPaths } from '$constants/settings-paths';
import { TemplateForm } from '$features/template/TemplateForm';
import { Layout } from '$layouts/Layout';
import { AccountService } from '$ssr/api/AccountService';
import { CategoryService } from '$ssr/api/CategoryService';

export const TemplateAddContainer = async () => {
  const categories = await CategoryService.getAllWithTree();
  const accounts = await AccountService.getAll();

  return (
    <Layout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm
        onSubmit={handleTemplateAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </Layout>
  );
};
