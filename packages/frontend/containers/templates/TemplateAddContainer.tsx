import { handleTemplateAdd } from '@/actions/template/handleTemplateAdd';
import { getAllAccounts, getAllCategoriesWithTree } from '@/api-service';
import { TemplateForm } from '@/features/template/TemplateForm';
import { Layout } from '@/layouts/Layout';

export const TemplateAddContainer = async () => {
  const categories = await getAllCategoriesWithTree();
  const accounts = await getAllAccounts();

  return (
    <Layout title="Add Template" backLink={'/templates'}>
      <TemplateForm
        onSubmit={handleTemplateAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </Layout>
  );
};
