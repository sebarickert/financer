import transactionCategoryModel, {
  ITransactionCategoryModel,
} from "../models/transaction-category-model";

export const findTransactionCategoriesByUser = async (
  userId: string
): Promise<ITransactionCategoryModel[] | null> =>
  transactionCategoryModel.find({ owner: userId });

export const createTransactionCategory = async (
  newTransactionCategory: ITransactionCategoryModel
): Promise<ITransactionCategoryModel | null> =>
  transactionCategoryModel.create(newTransactionCategory);
