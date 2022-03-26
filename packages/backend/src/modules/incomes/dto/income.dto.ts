import { OmitType } from '@nestjs/mapped-types';

import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class IncomeDto extends OmitType(TransactionDto, [
  'fromAccount',
  'fromAccountBalance',
] as const) {}
