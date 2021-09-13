import transactionCategoryModel, {
  ITransactionCategoryModel,
} from "../models/transaction-category-model";

export const findTransactionCategoriesByUser = async (
  userId: string
): Promise<ITransactionCategoryModel[] | null> =>
  transactionCategoryModel.find({ owner: userId });

export const findTransactionCategoryById = async (
  id: string
): Promise<ITransactionCategoryModel | null> =>
  transactionCategoryModel.findById(id);

export const createTransactionCategory = async (
  newTransactionCategory: ITransactionCategoryModel
): Promise<ITransactionCategoryModel | null> =>
  transactionCategoryModel.create(newTransactionCategory);
