import { TransactionCategoryMappingDto } from '@local/types';

import { Button } from '../button/button';
import { Divider } from '../divider/divider';
import { Icon, IconName } from '../icon/icon';
import { Input } from '../input/input';
import { Select, Option } from '../select/select';

interface TransactionCategoriesFormItemProps {
  className?: string;
  categoryAmountIndex: number;
  amountMaxValue: number;
  arrayIndex: number;
  categories: Option[];
  categoryMapping: TransactionCategoryMappingDto | undefined;
  deleteTransactionCategoryItem(): void;
  setUnallocatedAmount(): void;
  setTransactionCategoryItemAmount(newValue: number): void;
  amountValue: number;
  testId?: string;
}

export const TransactionCategoriesFormItem = ({
  className = '',
  categoryAmountIndex,
  amountMaxValue,
  arrayIndex,
  categories,
  categoryMapping,
  deleteTransactionCategoryItem,
  setTransactionCategoryItemAmount,
  amountValue,
  setUnallocatedAmount,
  testId = '',
}: TransactionCategoriesFormItemProps): JSX.Element => {
  return (
    <div
      className={className}
      data-testid={`${testId}_transaction-category_row`}
    >
      <Divider>{`Category Item #${arrayIndex + 1}`}</Divider>
      <div
        className="grid sm:grid-cols-[1fr,auto] gap-6 sm:gap-4 items-start mt-4"
        key={categoryAmountIndex}
      >
        <div className="space-y-4">
          <div className="grid gap-4">
            <Select
              id={`transactionCategory[${categoryAmountIndex}]category`}
              options={categories}
              defaultValue={categoryMapping?.category_id || ''}
              isRequired
              testId={`${testId}_transaction-category_category`}
            >
              Category
            </Select>
            <div className="grid grid-cols-[1fr,auto] gap-2 items-end">
              <Input
                id={`transactionCategory[${categoryAmountIndex}]amount`}
                type="number"
                min={0.01}
                step={0.01}
                max={amountMaxValue}
                isCurrency
                isRequired
                value={amountValue || categoryMapping?.amount || ''}
                onChange={(event) =>
                  setTransactionCategoryItemAmount(
                    parseFloat(event.target.value)
                  )
                }
                testId={`${testId}_transaction-category_amount`}
              >
                Amount
              </Input>
              <button
                type="button"
                className="border-gray-300 bg-white text-gray-700 shadow-sm hover:text-gray-500 inline-flex justify-center w-16 rounded-md items-center py-3 border font-medium text-base  focus-within:ring-2 focus:ring-inset focus:ring-blue-500 focus:outline-none transition ease-in-out duration-150 h-[50px]"
                onClick={setUnallocatedAmount}
              >
                <span className="sr-only">Add unallocated amount</span>
                <Icon type={IconName.plusCircle} />
              </button>
            </div>
          </div>
          <Input
            id={`transactionCategory[${categoryAmountIndex}]description`}
            value={categoryMapping?.description || ''}
            testId={`${testId}_transaction-category_description`}
          >
            Description
          </Input>
        </div>
        <Button
          className="sm:mt-6"
          onClick={deleteTransactionCategoryItem}
          accentColor="red"
          testId={`${testId}_delete-button`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
