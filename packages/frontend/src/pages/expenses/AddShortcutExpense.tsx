import { TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpenseForm } from './ExpenseForm';

import {
  CreateExpenseDto,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { useAddExpense } from '$hooks/expense/useAddExpense';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddShortcutExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-not-found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();

  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: transactionTemplate } = templateData;

  const parsedCategories = transactionTemplate?.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newExpenseJson = await addExpense(newExpenseData as any);

      if ('message' in newExpenseJson) {
        setErrors(parseErrorMessagesToArray(newExpenseJson.message));
        return;
      }

      navigate('/statistics/expenses');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <DataHandler {...templateData} />
      {transactionTemplate && (
        <>
          <UpdatePageInfo
            title={`Add ${transactionTemplate.description?.toLowerCase()}`}
            headerAction={
              <TransactionTemplateSwitcher
                templateType={TransactionType.EXPENSE}
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
            transactionCategoryMapping={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (parsedCategories as any[]) ?? undefined
            }
          />
        </>
      )}
    </>
  );
};
