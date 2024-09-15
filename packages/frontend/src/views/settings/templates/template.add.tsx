import { FC } from 'react';

import { TemplateForm } from './template.form';

import {
  CreateTransactionTemplateDto,
  TransactionTemplateType,
} from '$api/generated/financerApi';
import { CategoriesFormOnlyCategory } from '$blocks/transaction-categories/transaction-categories.types';
import { settingsPaths } from '$constants/settings-paths';
import { DefaultFormActionHandler } from '$hooks/useFinancerFormState';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories' | 'templateType'
> & {
  // TODO change this to match the backend, so make both of them to be array or non-array
  templateType: TransactionTemplateType;
  categories: CategoriesFormOnlyCategory[];
};

interface TemplateAddProps {
  onSubmit: DefaultFormActionHandler;
}

export const TemplateAdd: FC<TemplateAddProps> = ({ onSubmit }) => {
  return (
    <>
      <UpdatePageInfo backLink={settingsPaths.templates} />
      <TemplateForm onSubmit={onSubmit} submitLabel="Add" />
    </>
  );
};
