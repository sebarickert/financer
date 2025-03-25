import { Metadata } from 'next';

import { handleTemplateAdd } from '@/actions/template/handleTemplateAdd';
import { TemplateForm } from '@/features/template/TemplateForm';
import { ContentHeader } from '@/layouts/ContentHeader';
import { AccountService } from '@/ssr/api/AccountService';
import { CategoryService } from '@/ssr/api/CategoryService';

export const metadata: Metadata = {
  title: 'Add Template',
};

export default async function AddTemplatePage() {
  const categories = await CategoryService.getAllWithTree();
  const accounts = await AccountService.getAll();

  return (
    <>
      <ContentHeader title="Add Template" backLink={'/templates'} />
      <TemplateForm
        onSubmit={handleTemplateAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
