import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';

import { Button } from '../../elements/button/button';
import { Divider } from '../../elements/divider/divider';
import { Icon, IconName } from '../../elements/icon/icon';
import { Input } from '../../elements/input/input';
import { Option } from '../../elements/select/select';
import { Select } from '../../elements/select/select';

import { FieldArrayFields } from './transaction-categories-form';

import { ButtonGroup } from '$elements/button/button.group';

interface TransactionCategoriesFormItemProps {
  className?: string;
  index: number;
  categories: Option[];
  deleteTransactionCategoryItem(): void;
  setUnallocatedAmount(): void;
  testId?: string;
  categorySelectOnly?: boolean;
  // maxAmount: number;
  remove: UseFieldArrayRemove;
  onClose: () => void;
}

export const TransactionCategoriesFormItem = ({
  className = '',
  index,
  categories,
  deleteTransactionCategoryItem,
  setUnallocatedAmount,
  testId = '',
  categorySelectOnly,
  // maxAmount,
  remove,
  onClose,
}: TransactionCategoriesFormItemProps): JSX.Element => {
  const namePrefix = `categories.${index}` as const;

  const { getValues } = useFormContext<FieldArrayFields>();

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div
      className={className}
      data-testid={`${testId}_transaction-category_row`}
    >
      <Divider>{`Category Item #${index + 1}`}</Divider>
      <div className="grid sm:grid-cols-[1fr,auto] items-start mt-4">
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
                  // max={maxAmount}
                  isCurrency
                  isRequired
                  testId={`${testId}_transaction-category_amount`}
                >
                  Amount
                </Input>
                <button
                  onClick={setUnallocatedAmount}
                  className="inline-flex items-center justify-center h-[50px] w-11 focus:ring-black focus:border-black focus:outline-black rounded-md"
                >
                  <span className="sr-only">Add unallocated amount</span>
                  <Icon type={IconName.plus} />
                </button>
                {/* <Button onClick={setUnallocatedAmount} accentColor="plain"> */}
                {/* </Button> */}
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
        <ButtonGroup className="mt-12" isReverse isHorizontal>
          <Button
            className="sm:mt-6"
            onClick={handleSubmit}
            testId={`${testId}_delete-button`}
          >
            Add category
          </Button>
          <Button
            className="sm:mt-6"
            // onClick={deleteTransactionCategoryItem}
            testId={`${testId}_delete-button`}
            accentColor="plain"
          >
            Cancel
          </Button>
        </ButtonGroup>
        {/* <Button
          className="sm:mt-6"
          onClick={deleteTransactionCategoryItem}
          testId={`${testId}_delete-button`}
        >
          Delete
        </Button> */}
      </div>
    </div>
  );
};
