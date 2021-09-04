import { Response, Request } from "express";

import { ITransactionCategoryModel } from "../models/transaction-category-model";
import { IUserModel } from "../models/user-model";
import {
  createTransactionCategory,
  findTransactionCategoriesByUser,
} from "../services/transaction-category-service";

export const getAllUserTransactionCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const allTransactionCategories = await findTransactionCategoriesByUser(
    user.id
  );
  res.status(200).json(allTransactionCategories);
};

export const addTransactionCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const newTransactionCategoryData = req.body as ITransactionCategoryModel;

  const errors: string[] = [];

  if (
    !("name" in newTransactionCategoryData) ||
    newTransactionCategoryData.name.length === 0
  ) {
    errors.push("Name must not be empty.");
  }

  if (errors.length > 0) {
    res.status(400).json({ authorized: true, status: 400, errors });
    return;
  }

  newTransactionCategoryData.owner = user.id;
  const newTransactionCategory = await createTransactionCategory(
    newTransactionCategoryData
  );

  res
    .status(201)
    .json({ authorized: true, status: 201, payload: newTransactionCategory });
};
