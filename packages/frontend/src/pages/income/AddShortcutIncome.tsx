import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IncomeForm } from './IncomeForm';

import {
  CreateIncomeDto,
  TransactionTypeEnum,
  useIncomesCreateMutation,
  useTransactionTemplatesFindOneQuery,
} from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TransactionTemplateSwitcher } from '$blocks/transaction-template-switcher/transaction-template-switcher';
import { LoaderFullScreen } from '$elements/loader/loader.fullscreen';
import { UpdatePageInfo } from '$renderers/seo/updatePageInfo';
import { parseErrorMessagesToArray } from '$utils/apiHelper';

export const AddShortcutIncome = (): JSX.Element => {
  const navigate = useNavigate();
  const { id = 'id-not-found' } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<string[]>([]);
  const [addIncome, { isLoading: isCreating }] = useIncomesCreateMutation();

  const templateData = useTransactionTemplatesFindOneQuery({ id });
  const { data: transactionTemplate } = templateData;
  const parsedCategories = transactionTemplate?.categories?.map(
    (categoryId) => ({
      category_id: categoryId,
    })
  );

  const handleSubmit = async (newIncomeData: CreateIncomeDto) => {
    try {
      const newIncomeJson = await addIncome({
        createIncomeDto: newIncomeData,
      }).unwrap();

      if ('message' in newIncomeJson) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setErrors(parseErrorMessagesToArray((newIncomeJson as any).message));
        return;
      }

      navigate('/statistics/incomes');
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
                selectedTemplate={id}
                templateType={TransactionTypeEnum.Income}
              />
            }
          />
          <IncomeForm
            onSubmit={handleSubmit}
            errors={errors}
            submitLabel="Add"
            amount={transactionTemplate.amount ?? undefined}
            description={transactionTemplate.description ?? undefined}
            toAccount={transactionTemplate.toAccount ?? undefined}
            transactionCategoryMapping={parsedCategories ?? undefined}
          />
        </>
      )}
    </>
  );
};
