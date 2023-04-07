import { useMemo } from 'react';

import { ExpenseForm } from './expense-form';

import { ExpenseDto, UpdateExpenseDto } from '$api/generated/financerApi';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { inputDateFormat } from '$utils/formatDate';

interface EditExpenseProps {
  isLoading: boolean;
  expense: ExpenseDto;
  errors: string[];
  onSave: (expense: UpdateExpenseDto) => void;
}

export const EditExpense = ({
  isLoading,
  expense,
  errors,
  onSave,
}: EditExpenseProps): JSX.Element => {
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
      <UpdatePageInfo title={`Edit ${expense?.description}`} />
      <ExpenseForm
        onSubmit={onSave}
        errors={errors}
        submitLabel="Update"
        initialValues={initialValues}
      />
    </>
  );
};
