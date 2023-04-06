import { useMemo } from 'react';

import { IncomeForm } from './income-form';

import { IncomeDto, UpdateIncomeDto } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { inputDateFormat } from '$utils/formatDate';

interface EditIncomeProps {
  isLoading: boolean;
  income: IncomeDto;
  errors: string[];
  onSave: (income: UpdateIncomeDto) => void;
}

export const EditIncome = ({
  isLoading,
  income,
  errors,
  onSave,
}: EditIncomeProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!income) return undefined;
    return {
      ...income,
      date: inputDateFormat(new Date(income.date)),
    };
  }, [income]);

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <IncomeForm
        onSubmit={onSave}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
