import { CreateIncomeDto, TransactionCategoryMappingDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useTransactionTemplateById } from '../../hooks/transactionTemplate/useTransactionTemplateById';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const AddShortcutIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();

  const transactionTemplate = useTransactionTemplateById(id);
  const parsedCategories = transactionTemplate.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newIncomeData: CreateIncomeDto) => {
    try {
      const newIncomeJson = await addIncome(newIncomeData);

      if ('message' in newIncomeJson) {
        setErrors(parseErrorMessagesToArray(newIncomeJson.message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      <UpdatePageInfo
        title={`Add ${transactionTemplate.description?.toLowerCase()}`}
      />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Add"
        amount={transactionTemplate.amount ?? undefined}
        description={transactionTemplate.description ?? undefined}
        toAccount={transactionTemplate.toAccount ?? undefined}
        transactionCategoryMapping={
          (parsedCategories as TransactionCategoryMappingDto[]) ?? undefined
        }
      />
    </>
  );
};
