import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { handleTemplateAdd } from '@/actions/template/handleTemplateAdd';
import { getAllAccounts, getAllCategoriesWithTree } from '@/api-service';
import { TemplateForm } from '@/features/template/TemplateForm';
import { ContentHeader } from '@/layouts/ContentHeader';

export const metadata: Metadata = {
  title: 'Add Template',
};

export default async function AddTemplatePage() {
  const categories = await getAllCategoriesWithTree();
  const accounts = await getAllAccounts();

  if (!accounts.length) {
    redirect('/templates');
  }

  return (
    <>
      <ContentHeader title="Add Template" />
      <TemplateForm
        onSubmit={handleTemplateAdd}
        submitLabel="Add"
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
