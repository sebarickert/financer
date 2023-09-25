import { useState } from 'react';

import {
  CreateTransferDto,
  useTransfersCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { useUserDefaultTransferSourceAccount } from '$hooks/profile/user-preference/useUserDefaultTransferSourceAccount';
import { useUserDefaultTransferTargetAccount } from '$hooks/profile/user-preference/useUserDefaultTransferTargetAccount';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { AddTransfer } from '$pages/transfers/add-transfer';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

interface AddTransferContainerProps {
  templateId?: string;
}

export const AddTransferContainer = ({
  templateId,
}: AddTransferContainerProps) => {
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
        <AddTransfer
          defaultTransferSourceAccount={defaultTransferSourceAccount}
          defaultTransferTargetAccount={defaultTransferTargetAccount}
          transferTemplate={transactionTemplate}
          isLoading={isLoading}
          isCreating={isCreating}
          errors={errors}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
