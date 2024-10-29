import { OmitType } from '@nestjs/swagger';

import { TransactionListItemDto } from '../../transactions/dto/transaction-list-item.dto';

export class TransferListItemDto extends OmitType(
  TransactionListItemDto,
  [] as const,
) {}
