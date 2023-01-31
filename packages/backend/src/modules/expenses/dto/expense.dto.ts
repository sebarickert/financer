import { OmitType } from '@silte/nestjs-swagger';

import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class ExpenseDto extends OmitType(TransactionDto, [
  'toAccount',
] as const) {}
