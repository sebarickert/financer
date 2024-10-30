import { notFound } from 'next/navigation';
import { FC } from 'react';

import { handleTemplateEdit } from '$actions/template/handleTemplateEdit';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { TemplateForm } from '$modules/template/TemplateForm';
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

  // const handleDelete = () => handleTemplateDelete(template.id);

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
      // TODO Figure out why this crashes the page and failes fetch
      // headerAction={<TemplateDelete onSubmit={handleDelete} />}
    >
      <TemplateForm
        onSubmit={handleSubmit}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </Layout>
  );
};
