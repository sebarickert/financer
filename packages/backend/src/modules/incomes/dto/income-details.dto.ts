import { OmitType } from '@nestjs/swagger';

import { TransactionDetailsDto } from '../../transactions/dto/transaction-details.dto';

export class IncomeDetailsDto extends OmitType(TransactionDetailsDto, [
  'fromAccount',
  'fromAccountName',
] as const) {}
