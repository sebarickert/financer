import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpenseForm } from './ExpenseForm';

import {
  CreateExpenseDto,
  TransactionTypeEnum,
  useExpensesCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddShortcutExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-not-found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const [addExpense, { isLoading: isCreating }] = useExpensesCreateMutation();

  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: transactionTemplate } = templateData;

  const parsedCategories = transactionTemplate?.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      const newExpenseJson = await addExpense({
        createExpenseDto: newExpenseData,
      }).unwrap();

      if ('message' in newExpenseJson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setErrors(parseErrorMessagesToArray((newExpenseJson as any).message));
      }

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <DataHandler {...templateData} />
      {transactionTemplate && (
        <>
          <UpdatePageInfo
            title={`Add ${transactionTemplate.description?.toLowerCase()}`}
            headerAction={
              <TransactionTemplateSwitcher
                templateType={TransactionTypeEnum.Expense}
                selectedTemplate={id}
              />
            }
          />
          <ExpenseForm
            onSubmit={handleSubmit}
            errors={errors}
            submitLabel="Add"
            amount={transactionTemplate.amount ?? undefined}
            description={transactionTemplate.description ?? undefined}
            fromAccount={transactionTemplate.fromAccount ?? undefined}
            transactionCategoryMapping={parsedCategories ?? undefined}
          />
        </>
      )}
    </>
  );
};
