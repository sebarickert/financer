import { Router } from 'express';

import {
  verifyNewExpenseInfo,
  listUserExpenses,
} from '../controllers/expense-controller';
import {
  getTransaction,
  deleteTransaction,
  addTransaction,
  verifyTransactionOwnership,
  sendVerifyDelete,
} from '../controllers/transaction-controller';

export const expenseRouter = Router();

expenseRouter.get('/', listUserExpenses);

expenseRouter.post('/', verifyNewExpenseInfo, addTransaction);

expenseRouter.put(
  '/:id',
  verifyTransactionOwnership,
  verifyNewExpenseInfo,
  deleteTransaction,
  addTransaction
);

expenseRouter.get('/:id', verifyTransactionOwnership, getTransaction);

expenseRouter.delete(
  '/:id',
  verifyTransactionOwnership,
  deleteTransaction,
  sendVerifyDelete
);
