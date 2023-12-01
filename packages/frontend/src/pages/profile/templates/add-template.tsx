import { TemplateForm } from './template-form';

import { CreateTransactionTemplateDto } from '$api/generated/financerApi';
import { TransactionCategoriesFormFields } from '$blocks/transaction-categories/transaction-categories';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

export type CreateTransactionTemplateDtoWithCategory = Omit<
  CreateTransactionTemplateDto,
  'categories'
> & {
  categories: TransactionCategoriesFormFields[];
};

interface AddTemplateProps {
  isLoading: boolean;
  errors: string[];
  onSubmit: (data: CreateTransactionTemplateDtoWithCategory) => void;
}

export const AddTemplate = ({
  isLoading,
  errors,
  onSubmit,
}: AddTemplateProps): JSX.Element | null => {
  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add template"
        backLink="/profile/transaction-templates"
      />
      <TemplateForm onSubmit={onSubmit} errors={errors} submitLabel="Add" />
    </>
  );
};
