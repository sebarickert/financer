import { OmitType } from '@nestjs/swagger';

import { TransactionDto } from './transaction.dto';

export class CreateTransactionDto extends OmitType(TransactionDto, [
  '_id',
  'user',
  'fromAccount',
  'toAccount',
] as const) {}
