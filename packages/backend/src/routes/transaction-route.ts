import { Router } from 'express';

import {
  addTransaction,
  verifyNewTransferInfo,
  deleteTransaction,
  getAllUserTransactions,
  getTransaction,
  getTransfers,
  verifyTransactionOwnership,
  sendVerifyDelete,
} from '../controllers/transaction-controller';

export const transactionRouter = Router();

transactionRouter.post('/', verifyNewTransferInfo, addTransaction);

transactionRouter.put(
  '/:id',
  verifyTransactionOwnership,
  verifyNewTransferInfo,
  deleteTransaction,
  addTransaction
);

transactionRouter.get('/', getAllUserTransactions);

transactionRouter.get('/transfers', getTransfers);

transactionRouter.get('/:id', verifyTransactionOwnership, getTransaction);

transactionRouter.delete(
  '/:id',
  verifyTransactionOwnership,
  deleteTransaction,
  sendVerifyDelete
);
