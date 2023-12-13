import { useMemo } from 'react';

import { TransferForm } from './transfer.form';

import {
  CreateTransferDto,
  TransactionTemplateDto,
  TransactionTypeEnum,
} from '$api/generated/financerApi';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { Loader } from '$elements/loader/loader';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';

interface TransferAddProps {
  defaultTransferSourceAccount?: string;
  defaultTransferTargetAccount?: string;
  template?: TransactionTemplateDto;
  isLoading: boolean;
  isCreating: boolean;
  errors: string[];
  onSubmit: (newIncomeData: CreateTransferDto) => void;
}

export const TransferAdd = ({
  defaultTransferSourceAccount,
  defaultTransferTargetAccount,
  template,
  isLoading,
  isCreating,
  errors,
  onSubmit,
}: TransferAddProps): JSX.Element => {
  const initialValues = useMemo(() => {
    if (!template) {
      return {
        fromAccount: defaultTransferSourceAccount,
        toAccount: defaultTransferTargetAccount,
      };
    }
    const categories = template?.categories?.map((categoryId) => ({
      category_id: categoryId,
      amount: NaN,
    }));

    return {
      ...template,
      categories,
    };
  }, [defaultTransferSourceAccount, defaultTransferTargetAccount, template]);
  return (
    <>
      {isCreating && <LoaderFullScreen />}
      <UpdatePageInfo
        title="Add Transfer"
        headerAction={
          <TransactionTemplateSwitcher
            selectedTemplate={template?._id}
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
