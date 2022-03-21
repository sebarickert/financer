import { IIncome, ITransactionCategoryMapping } from '@local/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SEO } from '../../components/seo/seo';
import { useAddIncome } from '../../hooks/income/useAddIncome';
import { useUserDefaultIncomeAccount } from '../../hooks/profile/user-preference/useUserDefaultIncomeAccount';
import { useAddTransactionCategoryMapping } from '../../hooks/transactionCategoryMapping/useAddTransactionCategoryMapping';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { IncomeForm } from './IncomeForm';

export const AddIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const addIncome = useAddIncome();
  const addTransactionCategoryMapping = useAddTransactionCategoryMapping();
  const [defaultIncomeAccount] = useUserDefaultIncomeAccount();

  const handleSubmit = async (
    newIncomeData: IIncome,
    newTransactionCategoryMappingsData: ITransactionCategoryMapping[]
  ) => {
    try {
      const newIncomeJson = await addIncome(newIncomeData);

      if ('message' in newIncomeJson) {
        setErrors(parseErrorMessagesToArray(newIncomeJson.message));
        return;
      }

      if (newTransactionCategoryMappingsData.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newTransactionCategoryMappingJson =
          await addTransactionCategoryMapping(
            newTransactionCategoryMappingsData.map(
              (newTransactionCategoryMappingData) => ({
                ...newTransactionCategoryMappingData,
                transaction_id: newIncomeJson.payload._id,
              })
            )
          );
      }

      navigate('/statistics/incomes');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  return (
    <>
      <SEO title="Add income" />
      <IncomeForm
        onSubmit={handleSubmit}
        errors={errors}
        formHeading="Add income"
        submitLabel="Submit"
        toAccount={defaultIncomeAccount}
      />
    </>
  );
};
