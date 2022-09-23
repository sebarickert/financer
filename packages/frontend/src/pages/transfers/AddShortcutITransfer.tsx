import {
  CreateTransferDto,
  TransactionCategoryMappingDto,
  TransactionType,
} from '@local/types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { UpdatePageInfo } from '../../components/seo/updatePageInfo';
import { TransactionTemplatesSwitcher } from '../../components/transaction-template-switcher/transaction-templates-switcher';
import { useTransactionTemplateById } from '../../hooks/transactionTemplate/useTransactionTemplateById';
import { useAddTransfer } from '../../hooks/transfer/useAddTransfer';
import { parseErrorMessagesToArray } from '../../utils/apiHelper';

import { TransferForm } from './TransferForm';

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
      const newTransferJson = await addTransfer(newTransferData);

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
          <TransactionTemplatesSwitcher
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
        transactionCategoryMapping={
          (parsedCategories as TransactionCategoryMappingDto[]) ?? undefined
        }
      />
    </>
  );
};
