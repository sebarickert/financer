import { TemplateForm } from './template.form';

import { CreateTransactionTemplateDto } from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { settingsPaths } from '$constants/settings-paths';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories'
> & {
  categories: TransactionCategoriesFormFields[];
};

interface TemplateAddProps {
  onSubmit: (data: CreateTransactionTemplateDtoWithCategory) => void;
}

export const TemplateAdd = ({
  onSubmit,
}: TemplateAddProps): JSX.Element | null => {
  return (
    <>
      <UpdatePageInfo title="Add template" backLink={settingsPaths.templates} />
      <TemplateForm onSubmit={onSubmit} submitLabel="Add" />
    </>
  );
};
