import { useFormContext } from 'react-hook-form';

import { FieldArrayFields } from './transaction-categories';

import { Icon, IconName } from '$elements/icon/icon';
import { useTransactionCategoryName } from '$hooks/transactionCategories/useTransactionCategoryName';

type TransactionCategoriesItemProps = {
  index: number;
  onClick: () => void;
};

export const TransactionCategoriesItem = ({
  index,
  onClick,
}: TransactionCategoriesItemProps) => {
  const { watch, getValues } = useFormContext<FieldArrayFields>();

  const getTransactionCategoryName = useTransactionCategoryName();

  const values = watch(`categories.${index}`);
  const transactionCategory = getTransactionCategoryName(
    getValues(`categories.${index}.category_id`)
  );
  const description = getValues(`categories.${index}.description`);
  const amount = getValues(`categories.${index}.amount`);

  const isEmptyCategory = isNaN(parseInt(`${values.amount}`));

  if (isEmptyCategory) return null;

  return (
    <li className="grid grid-cols-[1fr,auto] items-center relative py-2">
      <span className="grid">
        <span className="font-medium truncate">{transactionCategory}</span>
        <span className="truncate">
          <span>
            <span className="sr-only">Amount: </span>
            {amount} €
          </span>
          {description && (
            <>
              {' - '}
              <span>
                <span className="sr-only">Description: </span>
                {description}
              </span>
            </>
          )}
        </span>
      </span>
      <button
        onClick={onClick}
        type="button"
        className="inline-flex items-center justify-center -mr-3 h-11 w-11"
      >
        <span className="sr-only">Edit category</span>
        <span className="absolute inset-0" aria-hidden="true" />
        <Icon type={IconName.pencilSquare} />
      </button>
    </li>
  );
};
