import { Router } from 'express';

import {
  addTransactionCategory,
  deleteTransactionCategory,
  getAllUserTransactionCategories,
  getTransactionCategory,
  updateTransactionCategory,
} from '../controllers/transaction-category-controller';

export const transactionCategoryRouter = Router();

transactionCategoryRouter.get('/', getAllUserTransactionCategories);

transactionCategoryRouter.post('/', addTransactionCategory);

transactionCategoryRouter.get('/:id', getTransactionCategory);

transactionCategoryRouter.delete('/:id', deleteTransactionCategory);

transactionCategoryRouter.put('/:id', updateTransactionCategory);
