import { useMemo } from 'react';

import { TemplateDelete } from './template.delete';
import { TemplateForm } from './template.form';

import {
  TransactionTemplateDto,
  TransactionTemplateType,
  UpdateTransactionTemplateDto,
} from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { settingsPaths } from '$constants/settings-paths';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type UpdateTransactionTemplateDtoWithCategory = Omit<
  UpdateTransactionTemplateDto,
  'categories' | 'templateType'
> & {
  // TODO change this to match the backend, so make both of them to be array or non-array
  templateType: TransactionTemplateType;
  categories?: TransactionCategoriesFormFields[];
};

interface TemplateEditProps {
  template: TransactionTemplateDto;
  onSubmit: (data: UpdateTransactionTemplateDtoWithCategory) => void;
  onDelete: () => void;
}

export const TemplateEdit = ({
  template,
  onSubmit,
  onDelete,
}: TemplateEditProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({
      ...template,
      templateType: template.templateType.at(0),
      categories: template?.categories?.map((categoryId) => ({
        categoryId: categoryId,
        amount: NaN,
      })),
    }),
    [template],
  );

  return (
    <>
      <UpdatePageInfo
        title="Edit template"
        backLink={settingsPaths.templates}
        headerAction={<TemplateDelete onSubmit={onDelete} />}
      />
      <TemplateForm
        onSubmit={onSubmit}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
