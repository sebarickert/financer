import { Router } from 'express';

import {
  addAccount,
  deleteAccount,
  getAccount,
  getAllAccountTransactions,
  listAccounts,
  updateAccount,
  verifyAccountOwnership,
} from '../controllers/account-controller';

export const accountRouter = Router();

accountRouter.get('/', listAccounts);

accountRouter.get('/:id', verifyAccountOwnership, getAccount);

accountRouter.post('/', addAccount);

accountRouter.delete('/:id', verifyAccountOwnership, deleteAccount);

accountRouter.put('/:id', verifyAccountOwnership, updateAccount);

accountRouter.get(
  '/:id/transactions',
  verifyAccountOwnership,
  getAllAccountTransactions
);
