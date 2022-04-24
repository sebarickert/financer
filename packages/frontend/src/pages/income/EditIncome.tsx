import { UpdateIncomeDto } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { useEditIncome } from '../../hooks/income/useEditIncome';
import { useIncomeById } from '../../hooks/income/useIncomeById';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const EditIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const { id = 'missing-id' } = useParams<{ id: string }>();

  const income = useIncomeById(id);
  const editIncome = useEditIncome();

  const handleSubmit = async (targetIncomeData: UpdateIncomeDto) => {
    if (!id) {
      console.error('Failed to edit income: no id');
      return;
    }
    try {
      const targetIncomeJson = await editIncome(targetIncomeData, id);

      if ('message' in targetIncomeJson) {
        setErrors(parseErrorMessagesToArray(targetIncomeJson.message));
        return;
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <UpdatePageInfo title={`Edit ${income.description}`} />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={income.amount}
        description={income.description}
        date={new Date(income.date)}
        toAccount={income.toAccount}
        transactionCategoryMapping={income.categories}
      />
    </>
  );
};
