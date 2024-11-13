import { FC } from 'react';

import { Button } from '$elements/Button/Button';
import { ButtonGroup } from '$elements/Button/button.group';
import { Divider } from '$elements/divider/divider';
import { Icon } from '$elements/Icon';
import { Input } from '$elements/input/input';
import { Select, Option } from '$elements/select/select';

type TransactionCategoriesFormProps = {
  className?: string;
  index: number;
  categories: Option[];
  categorySelectOnly?: boolean;
  maxAmount: number;
  isNewCategory?: boolean;
  setUnallocatedAmount(): void;
  handleCancel: () => void;
  handleDelete(): void;
  handleSubmit: () => void;
  formId: string;
};

export const TransactionCategoriesForm: FC<TransactionCategoriesFormProps> = ({
  className = '',
  index,
  categories,
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

  const testId = `transaction-categories-form`;

  return (
    <div className={className} data-testid={testId} data-category-index={index}>
      <Divider>{`Category Item #${index + 1}`}</Divider>
      <div className="grid items-start mt-4">
        <div className="grid gap-4">
          <Select
            id={`${namePrefix}.categoryId`}
            options={categories}
            isRequired
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
              <Input id={`${namePrefix}.description`}>Description</Input>
            </>
          )}
        </div>
        <ButtonGroup className="mt-12" isReverse isHorizontal>
          <Button
            haptic="light"
            onClick={handleSubmit}
            popoverTarget={formId}
            popoverTargetAction="hide"
          >
            {!isNewCategory ? 'Update' : 'Add'}
          </Button>
          {!isNewCategory ? (
            <Button
              haptic="medium"
              onClick={handleDelete}
              accentColor="secondary"
              popoverTarget={formId}
              popoverTargetAction="hide"
            >
              Delete
            </Button>
          ) : (
            <Button
              haptic="ultra-light"
              onClick={handleCancel}
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
