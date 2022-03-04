import { Router } from 'express';

import {
  verifyNewIncomeInfo,
  listUserIncomes,
} from '../controllers/income-controller';
import {
  addTransaction,
  deleteTransaction,
  getTransaction,
  sendVerifyDelete,
  verifyTransactionOwnership,
} from '../controllers/transaction-controller';

export const incomeRouter = Router();

incomeRouter.get('/', listUserIncomes);

incomeRouter.post('/', verifyNewIncomeInfo, addTransaction);

incomeRouter.put(
  '/:id',
  verifyTransactionOwnership,
  verifyNewIncomeInfo,
  deleteTransaction,
  addTransaction
);

incomeRouter.get('/:id', verifyTransactionOwnership, getTransaction);

incomeRouter.delete(
  '/:id',
  verifyTransactionOwnership,
  deleteTransaction,
  sendVerifyDelete
);
