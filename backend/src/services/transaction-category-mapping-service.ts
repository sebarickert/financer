// import transactionCategoryModel, {
//   ITransactionCategoryModel,
// } from "../models/transaction-category-model";

import transactionCategoryMappingModel, {
  ITransactionCategoryMappingModel,
} from "../models/transaction-category-mapping-model";

export const findTransactionCategoryMappingsByUser = async (
  userId: string
): Promise<ITransactionCategoryMappingModel[] | null> =>
  transactionCategoryMappingModel.find({
    owner: userId,
  });

export const findTransactionCategoryMappingById = async (
  id: string
): Promise<ITransactionCategoryMappingModel | null> =>
  transactionCategoryMappingModel.findOne({
    _id: id,
  });

export const createTransactionCategoryMapping = async (
  newTransactionCategoryMapping: ITransactionCategoryMappingModel
): Promise<ITransactionCategoryMappingModel | null> =>
  transactionCategoryMappingModel.create(newTransactionCategoryMapping);

export const findTransactionCategoryMappingByTransaction = async (
  id: string
): Promise<ITransactionCategoryMappingModel[] | null> =>
  transactionCategoryMappingModel.find({
    transaction_id: id,
  });

// export const markTransactionCategoryAsDeleted = async (
//   id: string
// ): Promise<ITransactionCategoryModel | null> => {
//   const transactionCategory = await findTransactionCategoryById(id);

//   if (transactionCategory === null) return null;

//   transactionCategory.deleted = true;

//   return transactionCategory.save();
// };
