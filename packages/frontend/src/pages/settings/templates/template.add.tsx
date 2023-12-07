import { TemplateForm } from './template.form';

import { CreateTransactionTemplateDto } from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { settingsPaths } from '$constants/settings-paths';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories'
> & {
  categories: TransactionCategoriesFormFields[];
};

interface TemplateAddProps {
  isLoading: boolean;
  errors: string[];
  onSubmit: (data: CreateTransactionTemplateDtoWithCategory) => void;
}

export const TemplateAdd = ({
  isLoading,
  errors,
  onSubmit,
}: TemplateAddProps): JSX.Element | null => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo title="Add template" backLink={settingsPaths.templates} />
      <TemplateForm onSubmit={onSubmit} errors={errors} submitLabel="Add" />
    </>
  );
};
