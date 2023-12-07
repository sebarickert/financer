import { useMemo } from 'react';

import { TemplateDelete } from './template.delete';
import { TemplateForm } from './template.form';

import {
  TransactionTemplateDto,
  UpdateTransactionTemplateDto,
} from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { settingsPaths } from '$constants/settings-paths';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type UpdateTransactionTemplateDtoWithCategory = Omit<
  UpdateTransactionTemplateDto,
  'categories'
> & {
  categories?: TransactionCategoriesFormFields[];
};

interface TemplateEditProps {
  isLoading: boolean;
  errors: string[];
  template: TransactionTemplateDto;
  onSubmit: (data: UpdateTransactionTemplateDtoWithCategory) => void;
  onDelete: () => void;
}

export const TemplateEdit = ({
  isLoading,
  errors,
  template,
  onSubmit,
  onDelete,
}: TemplateEditProps): JSX.Element => {
  const initialValues = useMemo(
    () => ({
      ...template,
      categories: template?.categories?.map((categoryId) => ({
        category_id: categoryId,
        amount: NaN,
      })),
    }),
    [template]
  );

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Edit template"
        backLink={settingsPaths.templates}
        headerAction={<TemplateDelete onSubmit={onDelete} />}
      />
      <TemplateForm
        onSubmit={onSubmit}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
