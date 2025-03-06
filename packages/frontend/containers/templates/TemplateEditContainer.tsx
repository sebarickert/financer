import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleTemplateEdit } from '@/actions/template/handleTemplateEdit';
import { TemplateDelete } from '@/features/template/TemplateDelete';
import { TemplateForm } from '@/features/template/TemplateForm';
import { Layout } from '@/layouts/Layout';
import { AccountService } from '@/ssr/api/AccountService';
import { CategoryService } from '@/ssr/api/CategoryService';
import { TransactionTemplateService } from '@/ssr/api/TransactionTemplateService';

interface TemplateEditContainerProps {
  id: string;
}

export const TemplateEditContainer: FC<TemplateEditContainerProps> = async ({
  id,
}) => {
  const template = await TransactionTemplateService.getById(id);

  if (!template) {
    notFound();
  }

  const initialValues = {
    ...template,
    amount: template.amount ?? undefined,
    dayOfMonth: template.dayOfMonth ?? undefined,
    dayOfMonthToCreate: template.dayOfMonthToCreate ?? undefined,
    templateType: template.templateType.at(0),
    categories: template?.categories?.map((categoryId) => ({
      categoryId: categoryId,
      amount: NaN,
    })),
  };

  const categories = await CategoryService.getAllWithTree();
  const accounts = await AccountService.getAll();

  const handleSubmit = handleTemplateEdit.bind(null, template);

  return (
    <Layout
      title="Edit Template"
      backLink={'/templates'}
      headerAction={<TemplateDelete id={template.id} />}
    >
      <TemplateForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        initialValues={initialValues}
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </Layout>
  );
};
