import { Injectable } from '@nestjs/common';

import { TransactionDocument } from '../transactions/schemas/transaction.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { UserId } from '../users/users.decorators';

@Injectable()
export class ExpensesService {
  constructor(private transactionService: TransactionsService) {}

  async findAllByUser(
    @UserId() userId: string,
  ): Promise<TransactionDocument[]> {
    return this.transactionService.findAllExpensesByUser(userId);
  }
}
