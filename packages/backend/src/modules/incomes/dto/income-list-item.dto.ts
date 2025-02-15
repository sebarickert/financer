import { OmitType } from '@nestjs/swagger';

import { TransactionListItemDto } from '@/transactions/dto/transaction-list-item.dto';

export class IncomeListItemDto extends OmitType(TransactionListItemDto, [
  'fromAccount',
] as const) {}
