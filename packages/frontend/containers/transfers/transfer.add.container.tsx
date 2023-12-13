import { useState } from 'react';

import {
  CreateTransferDto,
  useTransfersCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useUserDefaultTransferSourceAccount } from '$hooks/settings/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/settings/user-preference/useUserDefaultTransferTargetAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { TransferAdd } from '$pages/transfers/transfer.add';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface TransferAddContainerProps {
  templateId?: string;
}

export const TransferAddContainer = ({
  templateId,
}: TransferAddContainerProps) => {
  const { push } = useViewTransitionRouter();
  const [errors, setErrors] = useState<string[]>([]);
  const [addTransfer, { isLoading: isCreating }] = useTransfersCreateMutation();
  const {
    data: defaultTransferSourceAccount,
    isLoading: isLoadingDefaultSourceAccount,
  } = useUserDefaultTransferSourceAccount({ skip: !!templateId });
  const {
    data: defaultTransferTargetAccount,
    isLoading: isLoadingDefaultTargetAccount,
  } = useUserDefaultTransferTargetAccount({ skip: !!templateId });

  const templateData = useTransactionTemplatesFindOneQuery(
    { id: templateId as string },
    { skip: !templateId }
  );

  const { data: transactionTemplate } = templateData;

  const handleSubmit = async (newTransferData: CreateTransferDto) => {
    try {
      await addTransfer({
        createTransferDto: newTransferData,
      }).unwrap();

      push('/statistics/transfers');
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

  const isLoading =
    isLoadingDefaultSourceAccount || isLoadingDefaultTargetAccount;

  return (
    <>
      <DataHandler skipNotFound {...templateData} />
      {(!templateId || transactionTemplate) && (
        <TransferAdd
          defaultTransferSourceAccount={defaultTransferSourceAccount}
          defaultTransferTargetAccount={defaultTransferTargetAccount}
          template={transactionTemplate}
          isLoading={isLoading}
          isCreating={isCreating}
          errors={errors}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
