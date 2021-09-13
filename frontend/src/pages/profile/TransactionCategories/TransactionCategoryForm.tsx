import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Form from "../../../components/form/form";
import Input from "../../../components/input/input";
import Select, { IOption } from "../../../components/select/select";
import Alert from "../../../components/alert/alert";
import Loader from "../../../components/loader/loader";
import {
  deleteTransactionCategory,
  getAllTransactionCategories,
} from "./TransactionCategoriesService";
import CheckboxGroup from "../../../components/checkbox/checkbox.group";
import Checkbox from "../../../components/checkbox/checkbox";
import ModalConfirm from "../../../components/modal/confirm/modal.confirm";

interface ITransactionCategoryDeleteModalProps {
  handleDelete(): void;
}
interface ITransactionCategoryFormProps {
  errors: string[];
  onSubmit(transactionCategory: ITransactionCategory): void;
  formHeading: string;
  submitLabel: string;
  name?: string;
  visibility?: VisibilityType[];
  parentTransactioCategoryId?: string;
}

const TransactionCategoryDeleteModal = ({
  handleDelete,
}: ITransactionCategoryDeleteModalProps) => (
  <ModalConfirm
    label="Delete transaction category"
    submitButtonLabel="Delete"
    onConfirm={handleDelete}
    modalOpenButtonLabel="Delete transaction category"
    accentColor="red"
  >
    Are you sure you want to delete this transaction category? All of your data
    will be permanently removed. This action cannot be undone.
  </ModalConfirm>
);

const TransactionCategoryForm = ({
  errors,
  formHeading,
  onSubmit,
  parentTransactioCategoryId,
  submitLabel,
  name,
  visibility,
}: ITransactionCategoryFormProps): JSX.Element => {
  const history = useHistory();
  const [transactionCategoriesRaw, setTransactionCategoriesRaw] = useState<
    ITransactionCategory[] | null
  >(null);
  const [transactionCategories, setTransactionCategories] = useState<
    IOption[] | null
  >(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTransactionCategories = async () => {
      setTransactionCategoriesRaw(await getAllTransactionCategories());
    };
    fetchTransactionCategories();
  }, []);

  useEffect(() => {
    if (transactionCategoriesRaw === null) return;

    setTransactionCategories([
      { label: "None", value: undefined },
      ...transactionCategoriesRaw.map(
        ({ _id, name: transactionCategoryName }) => ({
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

  const handleDelete = async () => {
    deleteTransactionCategory(id);
    history.push("/profile/transaction-categories");
  };

  return transactionCategories === null ? (
    <Loader loaderColor="green" />
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
        optionalFooterComponent={
          <TransactionCategoryDeleteModal handleDelete={handleDelete} />
        }
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
