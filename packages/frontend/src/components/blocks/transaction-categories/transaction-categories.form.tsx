import { Button } from '../../elements/button/button';
import { Divider } from '../../elements/divider/divider';
import { Icon, IconName } from '../../elements/icon/icon';
import { Input } from '../../elements/input/input';
import { Option } from '../../elements/select/select';
import { Select } from '../../elements/select/select';

import { ButtonGroup } from '$elements/button/button.group';

interface TransactionCategoriesFormProps {
  className?: string;
  index: number;
  categories: Option[];
  testId?: string;
  categorySelectOnly?: boolean;
  maxAmount: number;
  isNewCategory?: boolean;
  setUnallocatedAmount(): void;
  handleCancel: () => void;
  handleDelete(): void;
  handleSubmit: () => void;
}

export const TransactionCategoriesForm = ({
  className = '',
  index,
  categories,
  testId = '',
  categorySelectOnly,
  maxAmount,
  isNewCategory,
  setUnallocatedAmount,
  handleCancel,
  handleDelete,
  handleSubmit,
}: TransactionCategoriesFormProps): JSX.Element => {
  const namePrefix = `categories.${index}` as const;

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
                  max={maxAmount}
                  isCurrency
                  isRequired
                  testId={`${testId}_transaction-category_amount`}
                >
                  Amount
                </Input>
                <button
                  onClick={setUnallocatedAmount}
                  className="inline-flex items-center justify-center h-[50px] w-11 focus:ring-black focus:border-black focus:outline-black rounded-md"
                  type="button"
                >
                  <span className="sr-only">Add unallocated amount</span>
                  <Icon type={IconName.plus} />
                </button>
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
            {!isNewCategory ? 'Update' : 'Add'}
          </Button>
          {!isNewCategory ? (
            <Button
              className="sm:mt-6"
              onClick={handleDelete}
              testId={`${testId}_delete-button`}
              accentColor="plain"
            >
              Delete
            </Button>
          ) : (
            <Button
              className="sm:mt-6"
              onClick={handleCancel}
              testId={`${testId}_cancel-button`}
              accentColor="plain"
            >
              Cancel
            </Button>
          )}
        </ButtonGroup>
      </div>
    </div>
  );
};
