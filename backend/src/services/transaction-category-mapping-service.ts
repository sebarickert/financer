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

// export const findTransactionCategoryById = async (
//   id: string
// ): Promise<ITransactionCategoryModel | null> =>
//   transactionCategoryModel.findOne({
//     _id: id,
//     deleted: { $ne: true },
//   });
// //
export const createTransactionCategoryMapping = async (
  newTransactionCategoryMapping: ITransactionCategoryMappingModel
): Promise<ITransactionCategoryMappingModel | null> =>
  transactionCategoryMappingModel.create(newTransactionCategoryMapping);

// export const markTransactionCategoryAsDeleted = async (
//   id: string
// ): Promise<ITransactionCategoryModel | null> => {
//   const transactionCategory = await findTransactionCategoryById(id);

//   if (transactionCategory === null) return null;

//   transactionCategory.deleted = true;

//   return transactionCategory.save();
// };
