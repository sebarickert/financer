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
  template?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newExpenseData: CreateExpenseDto) => void;
}

export const AddExpense = ({
  defaultExpenseAccount,
  template,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: AddExpenseProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!template) {
      return { fromAccount: defaultExpenseAccount };
    }
    const categories = template?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...template,
      categories,
    };
  }, [defaultExpenseAccount, template]);

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add Expense"
        headerAction={
          <TransactionTemplateSwitcher
            selectedTemplate={template?._id}
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
