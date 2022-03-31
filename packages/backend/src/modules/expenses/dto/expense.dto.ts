import { OmitType } from '@nestjs/mapped-types';

import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class ExpenseDto extends OmitType(TransactionDto, [
  'toAccount',
] as const) {}
