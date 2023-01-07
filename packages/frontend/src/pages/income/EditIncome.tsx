import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IncomeForm } from './IncomeForm';

import { UpdateIncomeDto } from '$api/generated/financerApi';
import { useEditIncome } from '$hooks/income/useEditIncome';
import { useIncomeById } from '$hooks/income/useIncomeById';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const targetIncomeJson = await editIncome(targetIncomeData as any, id);

      if ('message' in targetIncomeJson) {
        setErrors(parseErrorMessagesToArray(targetIncomeJson.message));
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
      <UpdatePageInfo title={`Edit ${income.description}`} />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Update"
        amount={income.amount}
        description={income.description}
        date={new Date(income.date)}
        toAccount={income.toAccount}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionCategoryMapping={income.categories as any}
      />
    </>
  );
};
