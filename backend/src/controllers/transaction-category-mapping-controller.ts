import { Response, Request } from "express";
import { ITransactionCategoryMappingModel } from "../models/transaction-category-mapping-model";
import { IUserModel } from "../models/user-model";
import {
  createTransactionCategoryMapping,
  findTransactionCategoryMappingById,
  findTransactionCategoryMappingByTransaction,
  findTransactionCategoryMappingsByUser,
} from "../services/transaction-category-mapping-service";
import { findTransactionById } from "../services/transaction-service";

export const getAllUserTransactionCategoryMappings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const allTransactionCategoryMappings =
    await findTransactionCategoryMappingsByUser(user.id);
  res.status(200).json(allTransactionCategoryMappings);
};

export const addTransactionCategoryMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const newTransactionCategoryMappingsData =
    req.body as ITransactionCategoryMappingModel[];

  const errors: string[] = [];

  newTransactionCategoryMappingsData.forEach(
    (newTransactionCategoryMappingData) => {
      if (
        !("amount" in newTransactionCategoryMappingData) ||
        newTransactionCategoryMappingData.amount <= 0
      ) {
        errors.push("Amount must be greater than zero.");
      }
    }
  );

  if (errors.length > 0) {
    res.status(400).json({
      authorized: true,
      status: 400,
      errors: Array.from(new Set(errors)),
    });
    return;
  }

  const newTransactionCategoryMappings = await Promise.all(
    newTransactionCategoryMappingsData.map(
      (newTransactionCategoryMappingData) =>
        createTransactionCategoryMapping({
          ...newTransactionCategoryMappingData,
          owner: user.id,
        } as ITransactionCategoryMappingModel)
    )
  );

  res.status(201).json({
    authorized: true,
    status: 201,
    payload: newTransactionCategoryMappings,
  });
};

export const getTransactionCategoryMapping = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const transactionCategoryMappingId = req.params.id;
  const transactionCategoryMapping = await findTransactionCategoryMappingById(
    transactionCategoryMappingId
  );

  if (transactionCategoryMapping === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Transaction category mapping not found."],
    });
    return;
  }

  if (`${transactionCategoryMapping?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that transaction category mapping."],
    });
    return;
  }

  res.status(200).json({
    authenticated: true,
    status: 200,
    payload: transactionCategoryMapping,
  });
};

export const getTransactionCategoryMappingsByTransactionId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const { transactionId } = req.params;

  const targetTransaction = await findTransactionById(transactionId);

  if (targetTransaction === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ["Transaction not found."],
    });
  }

  if (`${targetTransaction?.user}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ["Not authorized to view that transaction category mapping."],
    });
    return;
  }

  const transactionCategoryMappings =
    await findTransactionCategoryMappingByTransaction(transactionId);

  res.status(200).json({
    authenticated: true,
    status: 200,
    payload: transactionCategoryMappings,
  });
};
