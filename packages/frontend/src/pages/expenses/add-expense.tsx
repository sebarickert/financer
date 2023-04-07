import { useMemo } from 'react';

import { ExpenseForm } from './expense-form';

import {
  CreateExpenseDto,
  TransactionTemplateDto,
  TransactionTypeEnum,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface AddExpenseProps {
  defaultExpenseAccount?: string;
  expenseTemplate?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newExpenseData: CreateExpenseDto) => void;
}

export const AddExpense = ({
  defaultExpenseAccount,
  expenseTemplate,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: AddExpenseProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!expenseTemplate) {
      return { fromAccount: defaultExpenseAccount };
    }
    const categories = expenseTemplate?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...expenseTemplate,
      categories,
    };
  }, [defaultExpenseAccount, expenseTemplate]);

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add expense"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionTypeEnum.Expense}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <ExpenseForm
          onSubmit={onSubmit}
          errors={errors}
          submitLabel="Submit"
          initialValues={initialValues}
        />
      )}
    </>
  );
};
