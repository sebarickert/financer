import { useMemo } from 'react';

import { IncomeForm } from './income.form';

import {
  CreateIncomeDto,
  TransactionTemplateDto,
  TransactionTypeEnum,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface IncomeAddProps {
  defaultIncomeAccount?: string;
  template?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newIncomeData: CreateIncomeDto) => void;
}

export const IncomeAdd = ({
  defaultIncomeAccount,
  template,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: IncomeAddProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!template) {
      return { toAccount: defaultIncomeAccount };
    }
    const categories = template?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...template,
      categories,
    };
  }, [defaultIncomeAccount, template]);

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add Income"
        headerAction={
          <TransactionTemplateSwitcher
            selectedTemplate={template?._id}
            templateType={TransactionTypeEnum.Income}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <IncomeForm
          onSubmit={onSubmit}
          errors={errors}
          submitLabel="Submit"
          initialValues={initialValues}
        />
      )}
    </>
  );
};
