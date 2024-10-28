import { OmitType } from '@nestjs/swagger';

import { TransactionDetailsDto } from '../../transactions/dto/transaction-details.dto';

export class ExpenseDetailsDto extends OmitType(TransactionDetailsDto, [
  'toAccount',
  'toAccountName',
] as const) {}
