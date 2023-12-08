import { useMemo } from 'react';

import { IncomeForm } from './income.form';

import { IncomeDto, UpdateIncomeDto } from '$api/generated/financerApi';
import { TransactionDelete } from '$blocks/transaction-delete/transaction-delete';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { inputDateFormat } from '$utils/formatDate';

interface IncomeEditProps {
  isLoading: boolean;
  income: IncomeDto;
  errors: string[];
  onSave: (income: UpdateIncomeDto) => void;
  onDelete: () => void;
}

export const IncomeEdit = ({
  isLoading,
  income,
  errors,
  onSave,
  onDelete,
}: IncomeEditProps): JSX.Element => {
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
      <UpdatePageInfo
        title={`Edit ${income?.description}`}
        backLink={`/statistics/incomes/${income._id}`}
        headerAction={<TransactionDelete onDelete={onDelete} />}
      />
      <IncomeForm
        onSubmit={onSave}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
