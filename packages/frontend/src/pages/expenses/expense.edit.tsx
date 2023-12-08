import { useMemo } from 'react';

import { ExpenseForm } from './expense.form';

import { ExpenseDto, UpdateExpenseDto } from '$api/generated/financerApi';
import { TransactionDelete } from '$blocks/transaction-delete/transaction-delete';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { inputDateFormat } from '$utils/formatDate';

interface ExpenseEditProps {
  isLoading: boolean;
  expense: ExpenseDto;
  errors: string[];
  onSave: (expense: UpdateExpenseDto) => void;
  onDelete: () => void;
}

export const ExpenseEdit = ({
  isLoading,
  expense,
  errors,
  onSave,
  onDelete,
}: ExpenseEditProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!expense) return undefined;

    return {
      ...expense,
      date: inputDateFormat(new Date(expense.date)),
    };
  }, [expense]);

  return (
    <>
      {isLoading && <LoaderFullScreen />}
      <UpdatePageInfo
        title={`Edit ${expense?.description}`}
        backLink={`/statistics/expenses/${expense._id}`}
        headerAction={<TransactionDelete onDelete={onDelete} />}
      />
      <ExpenseForm
        onSubmit={onSave}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
