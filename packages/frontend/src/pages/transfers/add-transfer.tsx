import { useMemo } from 'react';

import { TransferForm } from './transfer-form';

import {
  CreateTransferDto,
  TransactionTemplateDto,
  TransactionTypeEnum,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface AddTransferProps {
  defaultTransferSourceAccount?: string;
  defaultTransferTargetAccount?: string;
  transferTemplate?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newIncomeData: CreateTransferDto) => void;
}

export const AddTransfer = ({
  defaultTransferSourceAccount,
  defaultTransferTargetAccount,
  transferTemplate,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: AddTransferProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!transferTemplate) {
      return {
        fromAccount: defaultTransferSourceAccount,
        toAccount: defaultTransferTargetAccount,
      };
    }
    const categories = transferTemplate?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...transferTemplate,
      categories,
    };
  }, [
    defaultTransferSourceAccount,
    defaultTransferTargetAccount,
    transferTemplate,
  ]);
  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add Transfer"
        headerAction={
          <TransactionTemplateSwitcher
            templateType={TransactionTypeEnum.Transfer}
          />
        }
      />
      {isLoading ? (
        <Loader />
      ) : (
        <TransferForm
          onSubmit={onSubmit}
          errors={errors}
          submitLabel="Submit"
          initialValues={initialValues}
        />
      )}
    </>
  );
};
