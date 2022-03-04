import { Router } from 'express';

import {
  addTransactionCategoryMapping,
  getAllUserTransactionCategoryMappings,
  getTransactionCategoryMapping,
  getTransactionCategoryMappingsByTransactionId,
} from '../controllers/transaction-category-mapping-controller';

export const transactionCategoryMappingRouter = Router();

transactionCategoryMappingRouter.get(
  '/',
  getAllUserTransactionCategoryMappings
);

transactionCategoryMappingRouter.post('/', addTransactionCategoryMapping);

transactionCategoryMappingRouter.get(
  '/by-transaction/:transactionId',
  getTransactionCategoryMappingsByTransactionId
);

transactionCategoryMappingRouter.get('/:id', getTransactionCategoryMapping);
