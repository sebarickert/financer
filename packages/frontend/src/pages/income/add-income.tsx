import { useMemo } from 'react';

import { IncomeForm } from './income-form';

import {
  CreateIncomeDto,
  TransactionTemplateDto,
  TransactionTypeEnum,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface AddIncomeProps {
  defaultIncomeAccount?: string;
  incomeTemplate?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newIncomeData: CreateIncomeDto) => void;
}

export const AddIncome = ({
  defaultIncomeAccount,
  incomeTemplate,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: AddIncomeProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!incomeTemplate) {
      return { toAccount: defaultIncomeAccount };
    }
    const categories = incomeTemplate?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...incomeTemplate,
      categories,
    };
  }, [defaultIncomeAccount, incomeTemplate]);

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add income"
        headerAction={
          <TransactionTemplateSwitcher
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
