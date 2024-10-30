import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleTemplateEdit } from '$actions/template/handleTemplateEdit';
import { settingsPaths } from '$constants/settings-paths';
import { TemplateDelete } from '$features/template/TemplateDelete';
import { TemplateForm } from '$features/template/TemplateForm';
import { Layout } from '$layouts/Layout';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';

type TemplateEditContainerProps = {
  id: string;
};

export const TemplateEditContainer: FC<TemplateEditContainerProps> = async ({
  id,
}) => {
  const template = await TransactionTemplateService.getById(id);

  if (!template) {
    notFound();
  }

  const initialValues = {
    ...template,
    templateType: template.templateType.at(0),
    categories: template?.categories?.map((categoryId) => ({
      categoryId: categoryId,
      amount: NaN,
    })),
  };

  const handleSubmit = handleTemplateEdit.bind(null, template);

  return (
    <Layout
      title="Edit Template"
      backLink={settingsPaths.templates}
      headerAction={<TemplateDelete id={template.id} />}
    >
      <TemplateForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </Layout>
  );
};
