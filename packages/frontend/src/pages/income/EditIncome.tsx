import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IncomeForm } from './IncomeForm';

import {
  UpdateIncomeDto,
  useIncomesFindOneQuery,
  useIncomesUpdateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const EditIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string[]>([]);
  const { id = 'missing-id' } = useParams<{ id: string }>();

  const incomeData = useIncomesFindOneQuery({ id });
  const { data: income } = incomeData;
  const [editIncome, { isLoading: isSaving }] = useIncomesUpdateMutation();

  const handleSubmit = async (targetIncomeData: UpdateIncomeDto) => {
    if (!id) {
      console.error('Failed to edit income: no id');
      return;
    }
    try {
      await editIncome({
        updateIncomeDto: targetIncomeData,
        id,
      }).unwrap();

      navigate('/statistics/incomes');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        setErrors(parseErrorMessagesToArray(error?.data?.message));
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <>
      {isSaving && <LoaderFullScreen />}
      <DataHandler {...incomeData} />
      <UpdatePageInfo title={`Edit ${income?.description}`} />
      {income && (
        <IncomeForm
          onSubmit={handleSubmit}
          errors={errors}
          submitLabel="Update"
          initialValues={income}
        />
      )}
    </>
  );
};
