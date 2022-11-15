import { TransactionCategoryMappingDto } from '@local/types';

import { Button } from '../../elements/button/button';
import { Divider } from '../../elements/divider/divider';
import { Icon, IconName } from '../../elements/icon/icon';
import { Input } from '../../elements/input/input';
import { Option } from '../../elements/select/select';
import { Select } from '../../elements/select/select';

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
  categorySelectOnly?: boolean;
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
  categorySelectOnly,
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
            {!categorySelectOnly && (
              <>
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
                  <Button onClick={setUnallocatedAmount} accentColor="plain">
                    <span className="sr-only">Add unallocated amount</span>
                    <Icon type={IconName.plusCircle} />
                  </Button>
                </div>
                <Input
                  id={`transactionCategory[${categoryAmountIndex}]description`}
                  value={categoryMapping?.description || ''}
                  testId={`${testId}_transaction-category_description`}
                >
                  Description
                </Input>
              </>
            )}
          </div>
        </div>
        <Button
          className="sm:mt-6"
          onClick={deleteTransactionCategoryItem}
          testId={`${testId}_delete-button`}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
