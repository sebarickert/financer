import { OmitType } from '@nestjs/mapped-types';

import { TransactionDto } from './transaction.dto';
export class CreateTransactionDto extends OmitType(TransactionDto, [
  '_id',
  'toAccountBalance',
  'fromAccountBalance',
] as const) {}
