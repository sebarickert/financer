import { TransactionType } from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import { CreateTransferDto } from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { useTransactionTemplateById } from '$hooks/transactionTemplate/useTransactionTemplateById';
import { useAddTransfer } from '$hooks/transfer/useAddTransfer';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddShortcutTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const addTransfer = useAddTransfer();

  const transactionTemplate = useTransactionTemplateById(id);
  const parsedCategories = transactionTemplate.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newTransferData: CreateTransferDto) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newTransferJson = await addTransfer(newTransferData as any);

      if ('message' in newTransferJson) {
        setErrors(parseErrorMessagesToArray(newTransferJson.message));
        return;
      }

      navigate('/statistics/transfers');
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
          <TransactionTemplateSwitcher
            templateType={TransactionType.TRANSFER}
            selectedTemplate={id}
          />
        }
      />
      <TransferForm
        onSubmit={handleSubmit}
        errors={errors}
        submitLabel="Add"
        amount={transactionTemplate.amount ?? undefined}
        description={transactionTemplate.description ?? undefined}
        toAccount={transactionTemplate.toAccount ?? undefined}
        fromAccount={transactionTemplate.fromAccount ?? undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionCategoryMapping={(parsedCategories as any) ?? undefined}
      />
    </>
  );
};
