import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { handleTemplateEdit } from '@/actions/template/handleTemplateEdit';
import {
  getAllAccounts,
  getAllCategoriesWithTree,
  getTransactionTemplateById,
} from '@/api-service';
import { TemplateDelete } from '@/features/template/TemplateDelete';
import { TemplateForm } from '@/features/template/TemplateForm';
import { ContentHeader } from '@/layouts/ContentHeader';

type Params = Promise<{
  templateId: string;
}>;

export const generateMetadata = async ({
  params,
}: {
  params: Params;
}): Promise<Metadata> => {
  const { templateId } = await params;
  const template = await getTransactionTemplateById(templateId);

  return {
    title: `Edit ${template.templateName}`,
  };
};

export default async function EditTemplatePage({ params }: { params: Params }) {
  const { templateId } = await params;

  const template = await getTransactionTemplateById(templateId);

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

  const categories = await getAllCategoriesWithTree();
  const accounts = await getAllAccounts();

  const handleSubmit = handleTemplateEdit.bind(null, template);

  return (
    <>
      <ContentHeader
        title={`Edit ${template.templateName}`}
        action={<TemplateDelete id={template.id} />}
      />
      <TemplateForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        initialValues={initialValues}
        transactionCategoriesWithCategoryTree={categories}
        accounts={accounts}
      />
    </>
  );
}
