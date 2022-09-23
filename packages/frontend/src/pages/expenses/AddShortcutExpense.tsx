import {
  CreateExpenseDto,
  TransactionCategoryMappingDto,
  TransactionType,
} from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionTemplatesSwitcher } from '../../components/transaction-template-switcher/transaction-templates-switcher';
import { useAddExpense } from '../../hooks/expense/useAddExpense';
import { useTransactionTemplateById } from '../../hooks/transactionTemplate/useTransactionTemplateById';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { ExpenseForm } from './ExpenseForm';

export const AddShortcutExpense = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const addExpense = useAddExpense();

  const transactionTemplate = useTransactionTemplateById(id);
  const parsedCategories = transactionTemplate.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newExpenseData: CreateExpenseDto) => {
    try {
      const newExpenseJson = await addExpense(newExpenseData);

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
      <UpdatePageInfo
        title={`Add ${transactionTemplate.description?.toLowerCase()}`}
        headerAction={
          <TransactionTemplatesSwitcher
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
          (parsedCategories as TransactionCategoryMappingDto[]) ?? undefined
        }
      />
    </>
  );
};
