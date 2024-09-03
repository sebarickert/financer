import { TemplateForm } from './template.form';

import {
  CreateTransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { settingsPaths } from '$constants/settings-paths';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories' | 'templateType'
> & {
  // TODO change this to match the backend, so make both of them to be array or non-array
  templateType: TransactionTemplateType;
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
      <UpdatePageInfo backLink={settingsPaths.templates} />
      <TemplateForm onSubmit={onSubmit} submitLabel="Add" />
    </>
  );
};
