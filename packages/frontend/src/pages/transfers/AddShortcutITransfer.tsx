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
    })
  );

  const handleSubmit = async (newTransferData: CreateTransferDto) => {
    try {
      const newTransferJson = await addTransfer({
        createTransferDto: newTransferData,
      });

      if ('message' in newTransferJson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setErrors(parseErrorMessagesToArray((newTransferJson as any).message));
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
            amount={transactionTemplate.amount ?? undefined}
            description={transactionTemplate.description ?? undefined}
            toAccount={transactionTemplate.toAccount ?? undefined}
            fromAccount={transactionTemplate.fromAccount ?? undefined}
            transactionCategoryMapping={
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (parsedCategories as any[]) ?? undefined
            }
          />
        </>
      )}
    </>
  );
};
