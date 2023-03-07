import { Button } from '../../elements/button/button';
import { Divider } from '../../elements/divider/divider';
import { Icon, IconName } from '../../elements/icon/icon';
import { Input } from '../../elements/input/input';
import { Option } from '../../elements/select/select';
import { Select } from '../../elements/select/select';

interface TransactionCategoriesFormItemProps {
  className?: string;
  index: number;
  categories: Option[];
  deleteTransactionCategoryItem(): void;
  setUnallocatedAmount(): void;
  testId?: string;
  categorySelectOnly?: boolean;
  namePrefix: string;
  maxAmount: number;
}

export const TransactionCategoriesFormItem = ({
  className = '',
  index,
  categories,
  deleteTransactionCategoryItem,
  setUnallocatedAmount,
  testId = '',
  categorySelectOnly,
  namePrefix,
  maxAmount,
}: TransactionCategoriesFormItemProps): JSX.Element => {
  return (
    <div
      className={className}
      data-testid={`${testId}_transaction-category_row`}
    >
      <Divider>{`Category Item #${index + 1}`}</Divider>
      <div className="grid sm:grid-cols-[1fr,auto] gap-6 sm:gap-4 items-start mt-4">
        <div className="space-y-4">
          <div className="grid gap-4">
            <Select
              id={`${namePrefix}.category_id`}
              options={categories}
              isRequired
              testId={`${testId}_transaction-category_category`}
            >
              Category
            </Select>
            {!categorySelectOnly && (
              <>
                <div className="grid grid-cols-[1fr,auto] gap-2 items-end">
                  <Input
                    id={`${namePrefix}.amount`}
                    type="number"
                    min={0.01}
                    step={0.01}
                    max={maxAmount}
                    isCurrency
                    isRequired
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
                  id={`${namePrefix}.description`}
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
