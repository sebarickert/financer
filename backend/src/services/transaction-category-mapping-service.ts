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

export const createMultipleTransactionCategoryMappings = async (
  newTransactionCategoryMappings: ITransactionCategoryMappingModel[]
): Promise<ITransactionCategoryMappingModel[] | null> =>
  transactionCategoryMappingModel.insertMany(newTransactionCategoryMappings);

export const findTransactionCategoryMappingByTransaction = async (
  id: string
): Promise<ITransactionCategoryMappingModel[] | null> =>
  transactionCategoryMappingModel.find({
    transaction_id: id,
  });

export const deleteTransactionCategoryMappingByTransaction = async (
  id: string
): Promise<void> => {
  await transactionCategoryMappingModel.deleteMany({
    transaction_id: id,
  });
};

// export const markTransactionCategoryAsDeleted = async (
//   id: string
// ): Promise<ITransactionCategoryModel | null> => {
//   const transactionCategory = await findTransactionCategoryById(id);

//   if (transactionCategory === null) return null;

//   transactionCategory.deleted = true;

//   return transactionCategory.save();
// };

// eslint-disable-next-line @typescript-eslint/naming-convention
export const DANGER_truncateTransactionCategoryMappingsByUser = async (
  userId: string
): Promise<void> => {
  await transactionCategoryMappingModel.deleteMany({ owner: userId });
};
