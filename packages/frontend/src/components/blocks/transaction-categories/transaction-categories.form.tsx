import { FC } from 'react';

import { Button } from '../../elements/button/button';
import { Divider } from '../../elements/divider/divider';
import { Input } from '../../elements/input/input';
import { Option } from '../../elements/select/select';
import { Select } from '../../elements/select/select';

import { ButtonGroup } from '$elements/button/button.group';
import { Icon } from '$elements/Icon';

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
  formId: string;
}

export const TransactionCategoriesForm: FC<TransactionCategoriesFormProps> = ({
  className = '',
  index,
  categories,
  testId: testIdRaw = '',
  categorySelectOnly,
  maxAmount,
  isNewCategory,
  setUnallocatedAmount,
  handleCancel,
  handleDelete,
  handleSubmit,
  formId,
}) => {
  if (index < 0) return null;

  const namePrefix = `categories.${index}` as const;

  const testId = `${testIdRaw}-form`;

  return (
    <div className={className} data-testid={testId}>
      <Divider>{`Category Item #${index + 1}`}</Divider>
      <div className="grid items-start mt-4">
        <div className="grid gap-4">
          <Select
            id={`${namePrefix}.categoryId`}
            options={categories}
            isRequired
            testId={`${testId}-select`}
            placeholder="Select category"
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
                  isRequired
                  testId={`${testId}-amount`}
                >
                  Amount
                </Input>
                <button
                  onClick={setUnallocatedAmount}
                  className="inline-flex items-center justify-center h-[50px] w-11 focus-visible:ring-black focus-visible:border-black focus-visible:outline-black rounded-md"
                  type="button"
                >
                  <span className="sr-only">Add unallocated amount</span>
                  <Icon name="PlusIcon" />
                </button>
              </div>
              <Input
                id={`${namePrefix}.description`}
                testId={`${testId}-description`}
              >
                Description
              </Input>
            </>
          )}
        </div>
        <ButtonGroup className="mt-12" isReverse isHorizontal>
          <Button
            onClick={handleSubmit}
            testId={`${testId}-submit`}
            popoverTarget={formId}
            popoverTargetAction="hide"
          >
            {!isNewCategory ? 'Update' : 'Add'}
          </Button>
          {!isNewCategory ? (
            <Button
              onClick={handleDelete}
              testId={`${testId}-delete`}
              accentColor="secondary"
              popoverTarget={formId}
              popoverTargetAction="hide"
            >
              Delete
            </Button>
          ) : (
            <Button
              onClick={handleCancel}
              testId={`${testId}-cancel`}
              accentColor="secondary"
              popoverTarget={formId}
              popoverTargetAction="hide"
            >
              Cancel
            </Button>
          )}
        </ButtonGroup>
      </div>
    </div>
  );
};
