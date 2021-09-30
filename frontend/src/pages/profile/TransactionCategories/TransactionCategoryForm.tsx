import React, { useEffect, useState } from "react";
import Form from "../../../components/form/form";
import Input from "../../../components/input/input";
import Select, { IOption } from "../../../components/select/select";
import Alert from "../../../components/alert/alert";
import Loader from "../../../components/loader/loader";
import {
  getAllTransactionCategoriesWithCategoryTree,
  ITransactionCategoryWithCategoryTree,
} from "./TransactionCategoriesService";
import CheckboxGroup from "../../../components/checkbox/checkbox.group";
import Checkbox from "../../../components/checkbox/checkbox";

interface ITransactionCategoryFormProps {
  errors: string[];
  onSubmit(transactionCategory: ITransactionCategory): void;
  formHeading: string;
  submitLabel: string;
  name?: string;
  visibility?: VisibilityType[];
  parentTransactioCategoryId?: string;
  optionalFooterComponent?: React.ReactNode;
}

const TransactionCategoryForm = ({
  errors,
  formHeading,
  onSubmit,
  parentTransactioCategoryId,
  submitLabel,
  name,
  visibility,
  optionalFooterComponent,
}: ITransactionCategoryFormProps): JSX.Element => {
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategoryWithCategoryTree[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(
        await getAllTransactionCategoriesWithCategoryTree()
      );
    };
    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories([
      { label: "None", value: undefined },
      ...transactionCategoriesRaw.map(
        ({ _id, categoryTree: transactionCategoryName }) => ({
          value: _id,
          label: transactionCategoryName,
        })
      ),
    ]);
  }, [transactionCategoriesRaw]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const {
      transactionCategoryName: newCategoryName,
      parentTransactionCategory: newParentTransactionCategory,
      incomeVisible: newIncomeVisible,
      expenseVisible: newExpenseVisible,
      transferVisible: newTransferVisible,
    } = event.target;

    const newVisibility = [
      newIncomeVisible.checked ? "income" : "",
      newExpenseVisible.checked ? "expense" : "",
      newTransferVisible.checked ? "transfer" : "",
    ].filter((i) => i !== "") as VisibilityType[];

    const newTransactionCategoryData: ITransactionCategory = {
      name: newCategoryName.value,
      parent_category_id:
        newParentTransactionCategory.value === "None"
          ? null
          : newParentTransactionCategory.value,
      visibility: newVisibility,
    };

    onSubmit(newTransactionCategoryData);
  };

  return transactionCategories === null ? (
    <Loader loaderColor="blue" />
  ) : (
    <>
      {errors.length > 0 && (
        <Alert additionalInformation={errors}>
          There were {errors.length} errors with your submission
        </Alert>
      )}
      <Form
        submitLabel={submitLabel}
        formHeading={formHeading}
        handleSubmit={handleSubmit}
        accentColor="green"
        formFooterBackLink="/profile/transaction-categories"
        optionalFooterComponent={optionalFooterComponent}
      >
        <div className="grid gap-y-6 gap-x-4">
          <Input
            id="transactionCategoryName"
            help="Name of the transaction category, e.g. food, hobby, car, etc."
            isRequired
            value={name}
          >
            Name
          </Input>
          <CheckboxGroup>
            <Checkbox
              id="incomeVisible"
              label="Income"
              checked={visibility?.some((item) => item === "income")}
            />
            <Checkbox
              id="expenseVisible"
              label="Expense"
              checked={visibility?.some((item) => item === "expense")}
            />
            <Checkbox
              id="transferVisible"
              label="Transfer"
              checked={visibility?.some((item) => item === "transfer")}
            />
          </CheckboxGroup>
          <Select
            id="parentTransactionCategory"
            options={transactionCategories}
            defaultValue={parentTransactioCategoryId}
            isRequired
          >
            Parent transaction category
          </Select>
        </div>
      </Form>
    </>
  );
};

export default TransactionCategoryForm;
