import { OmitType } from '@nestjs/swagger';

import { TransactionDto } from '../../transactions/dto/transaction.dto';

export class IncomeDto extends OmitType(TransactionDto, [
  'fromAccount',
] as const) {}
