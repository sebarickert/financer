import { useFormContext } from 'react-hook-form';

import { FieldArrayFields } from './transaction-categories';

import { Icon } from '$elements/Icon';
import { hapticRunner } from '$utils/haptic.helper';

type TransactionCategoriesItemProps = {
  index: number;
  categorySelectOnly?: boolean;
  onClick: () => void;
  getCategoryNameById: (categoryId: string) => string;
  formId: string;
};

export const TransactionCategoriesItem = ({
  index,
  categorySelectOnly,
  onClick,
  getCategoryNameById,
  formId,
}: TransactionCategoriesItemProps) => {
  const { watch, getValues } = useFormContext<FieldArrayFields>();
  const values = watch(`categories.${index}`);

  const categoryId = getValues(`categories.${index}.categoryId`);
  const transactionCategory = getCategoryNameById(categoryId);

  const { description, amount } = getValues(`categories.${index}`);

  const isEmptyCategory = isNaN(parseFloat(`${values.amount}`));

  const categoryAmount = isEmptyCategory ? '-' : amount;

  const testId = `transaction-categories-item`;

  return (
    <li
      className="grid grid-cols-[1fr,auto] items-center relative py-2 theme-text-primary"
      data-testid={testId}
    >
      <span className="grid">
        <input
          type="hidden"
          name={`categories[${index}][categoryId]`}
          value={categoryId}
        />
        {!categorySelectOnly && (
          <>
            <input
              type="hidden"
              name={`categories[${index}][description]`}
              value={description}
            />
            <input
              type="hidden"
              name={`categories[${index}][amount]`}
              value={amount}
            />
          </>
        )}
        <span className="font-medium truncate" data-testid={`${testId}-name`}>
          {transactionCategory}
        </span>
        <span className="truncate">
          <span>
            <span className="sr-only">Amount: </span>
            <span data-testid={`${testId}-amount`}>{categoryAmount}</span> €
          </span>
          {description && (
            <>
              {' - '}
              <span>
                <span className="sr-only">Description: </span>
                <span data-testid={`${testId}-description`}>{description}</span>
              </span>
            </>
          )}
        </span>
      </span>
      <button
        onClick={() => {
          hapticRunner('light');
          onClick();
        }}
        type="button"
        className="inline-flex items-center justify-center -mr-3 rounded-md h-11 w-11 theme-focus theme-layer-color-with-hover"
        data-testid={`${testId}-edit`}
        // @ts-expect-error popovertarget is not a valid prop
        popovertarget={formId}
      >
        <span className="sr-only">Edit category</span>
        <span className="absolute inset-0" aria-hidden="true" />
        <Icon name="PencilIcon" />
      </button>
    </li>
  );
};
