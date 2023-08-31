import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { TransactionCategoriesFormItem } from './transaction-categories-form.item';

import { Drawer } from '$blocks/drawer/drawer';
import { Button } from '$elements/button/button';
import { Option } from '$elements/select/select';

interface TransactionCategoriesFormProps {
  className?: string;
  transactionCategories: Option[];
  testId?: string;
  categorySelectOnly?: boolean;
}

export interface TransactionCategoriesFormFields {
  description?: string;
  category_id: string;
  amount: number;
}

export interface FieldArrayFields {
  categories: TransactionCategoriesFormFields[];
}

type PlaaProps = {
  index: number;
  onClick: () => void;
};

const Plaa = ({ index, onClick }: PlaaProps) => {
  const { watch, getValues } = useFormContext<FieldArrayFields>();

  const values = watch(`categories.${index}`);

  const isEmptyCategory = isNaN(parseInt(`${values.amount}`));

  if (isEmptyCategory) return null;

  return (
    <li className="flex flex-col">
      <b>
        {getValues(`categories.${index}.description`)} -{' '}
        {getValues(`categories.${index}.amount`)}
      </b>
      <button onClick={onClick}>CLICK MEEEEE</button>
    </li>
  );
};

export const TransactionCategoriesForm = ({
  className = '',
  transactionCategories,
  testId = 'transaction-categories-form',
  categorySelectOnly,
}: TransactionCategoriesFormProps): JSX.Element => {
  const { fields, append, remove } = useFieldArray<FieldArrayFields>({
    name: 'categories',
  });
  const { getValues } = useFormContext<FieldArrayFields>();
  const [selectedIndex, setSelectedIndex] = useState(NaN);
  const [previousSelected, setPreviousSelected] = useState(NaN);

  // const { setValue } = useFormContext();

  // const transactionAmount = useWatch({ name: 'amount' });

  const totalAllocatedAmount = fields
    .map(({ amount }) => amount || 0)
    .reduce((current, previous) => current + previous, 0);

  console.log(fields);

  const addNewCategory = () => {
    append({} as TransactionCategoriesFormFields);
    setSelectedIndex(fields.length);
  };

  const isEmptyCategory = (index: number) =>
    isNaN(parseInt(`${getValues(`categories.${index}`).amount}`));

  const onClose = () => {
    const values = getValues(`categories.${selectedIndex}`);

    console.log('ASDASDASD', parseInt(`${values.amount}`), selectedIndex);
    if (isEmptyCategory(selectedIndex)) {
      remove(selectedIndex);
    }
    setPreviousSelected(selectedIndex);
    setSelectedIndex(NaN);
  };

  return (
    <>
      <button
        onClick={() => console.log(getValues(`categories.${previousSelected}`))}
      >
        PLAAA PLAAA
      </button>

      <Button
        // onClick={() => append({} as TransactionCategoriesFormFields)}
        onClick={addNewCategory}
        accentColor="plain"
        // isDisabled={!transactionAmount || transactionAmount < 0}
        testId="add-category-button"
      >
        Add category
      </Button>
      <Drawer
        isOpen={!isNaN(selectedIndex)}
        onClose={onClose}
        heading="Add category item"
      >
        <TransactionCategoriesFormItem
          key={selectedIndex}
          index={selectedIndex}
          categories={transactionCategories}
          deleteTransactionCategoryItem={() => remove(selectedIndex)}
          setUnallocatedAmount={() => {
            // const unallocatedAmount =
            //   transactionAmount - totalAllocatedAmount + (0 || 0);
            // setValue(`categories.${selectedIndex}.amount`, unallocatedAmount);
          }}
          testId={testId}
          categorySelectOnly={categorySelectOnly}
          // maxAmount={transactionAmount}
          remove={remove}
          onClose={onClose}
        />
      </Drawer>
      <ul>
        {fields.map(({ id, amount = 0 }, index) => (
          <Plaa
            key={id}
            index={index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </ul>
      {/* <div className={className} data-testid={testId}>
        {fields.map(({ id, amount = 0 }, index) => (
          <TransactionCategoriesFormItem
            index={index}
            categories={transactionCategories}
            namePrefix={`categories.${index}`}
            deleteTransactionCategoryItem={() => remove(index)}
            setUnallocatedAmount={() => {
              const unallocatedAmount =
                transactionAmount - totalAllocatedAmount + (amount || 0);
              setValue(`categories.${index}.amount`, unallocatedAmount);
            }}
            testId={testId}
            key={id}
            categorySelectOnly={categorySelectOnly}
            maxAmount={transactionAmount}
          />
        ))}
      </div> */}
    </>
  );
};
