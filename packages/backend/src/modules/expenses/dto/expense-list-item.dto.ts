import { OmitType } from '@nestjs/swagger';

import { TransactionListItemDto } from '../../transactions/dto/transaction-list-item.dto';

export class ExpenseListItemDto extends OmitType(TransactionListItemDto, [
  'toAccount',
] as const) {}
