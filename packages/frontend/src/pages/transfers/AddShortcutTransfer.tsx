import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { TransferForm } from './TransferForm';

import {
  CreateTransferDto,
  TransactionTypeEnum,
  useTransactionTemplatesFindOneQuery,
  useTransfersCreateMutation,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddShortcutTransfer = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-not-found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransfer, { isLoading: isCreating }] = useTransfersCreateMutation();

  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: transactionTemplate } = templateData;
  const parsedCategories = transactionTemplate?.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    })
  );

  const handleSubmit = async (newTransferData: CreateTransferDto) => {
    try {
      await addTransfer({
        createTransferDto: newTransferData,
      }).unwrap();

      navigate('/statistics/transfers');
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
      {isCreating && <LoaderFullScreen />}
      <DataHandler {...templateData} />
      {transactionTemplate && (
        <>
          <UpdatePageInfo
            title={`Add ${transactionTemplate.description?.toLowerCase()}`}
            headerAction={
              <TransactionTemplateSwitcher
                templateType={TransactionTypeEnum.Transfer}
                selectedTemplate={id}
              />
            }
          />
          <TransferForm
            onSubmit={handleSubmit}
            errors={errors}
            submitLabel="Add"
            initialValues={{
              ...transactionTemplate,
              categories: parsedCategories,
            }}
          />
        </>
      )}
    </>
  );
};