import { Response, Request } from 'express';

import { ITransactionCategoryModel } from '../models/transaction-category-model';
import { IUserModel } from '../models/user-model';
import {
  createTransactionCategory,
  findTransactionCategoriesByUser,
  findTransactionCategoryById,
  markTransactionCategoryAsDeleted,
} from '../services/transaction-category-service';

export const getAllUserTransactionCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const allTransactionCategories = await findTransactionCategoriesByUser(
    user.id
  );

  res.status(200).json({
    authenticated: true,
    status: 200,
    payload: allTransactionCategories,
  });
};

export const addTransactionCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const newTransactionCategoryData = req.body as ITransactionCategoryModel;

  const errors: string[] = [];

  if (
    !('name' in newTransactionCategoryData) ||
    newTransactionCategoryData.name.length === 0
  ) {
    errors.push('Name must not be empty.');
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

export const getTransactionCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const transactionCategoryId = req.params.id;
  const transactionCategory = await findTransactionCategoryById(
    transactionCategoryId
  );

  if (transactionCategory === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ['Transaction category not found.'],
    });
    return;
  }

  if (`${transactionCategory?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ['Not authorized to view that transaction category.'],
    });
    return;
  }
  res
    .status(200)
    .json({ authenticated: true, status: 200, payload: transactionCategory });
};

export const updateTransactionCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const transactionCategoryId = req.params.id;
  const modifiedAccountData = req.body as ITransactionCategory;

  const transactionCategory = await findTransactionCategoryById(
    transactionCategoryId
  );

  if (`${transactionCategory?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ['You can only edit your transaction categories.'],
    });
    return;
  }

  if (transactionCategory === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ['Transaction category not found.'],
    });
    return;
  }

  if ('name' in modifiedAccountData) {
    transactionCategory.name = modifiedAccountData.name;
  }

  if ('visibility' in modifiedAccountData) {
    transactionCategory.visibility = modifiedAccountData.visibility;
  }

  if ('parent_category_id' in modifiedAccountData) {
    transactionCategory.parent_category_id =
      modifiedAccountData.parent_category_id;
  }

  await transactionCategory?.save();

  res.status(200).json({ authenticated: true, status: 200 });
};

export const deleteTransactionCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = req.user as IUserModel;
  const transactionCategoryId = req.params.id;
  const transactionCategory = await findTransactionCategoryById(
    transactionCategoryId
  );

  if (transactionCategory === null) {
    res.status(404).json({
      authenticated: true,
      status: 404,
      errors: ['Transaction category not found.'],
    });
    return;
  }

  if (`${transactionCategory?.owner}` !== `${user._id}`) {
    res.status(403).json({
      authenticated: true,
      status: 403,
      errors: ['You can only delete your own transaction categories.'],
    });
    return;
  }

  await markTransactionCategoryAsDeleted(transactionCategoryId);

  res.status(200).json({ authenticated: true, status: 200 });
};
