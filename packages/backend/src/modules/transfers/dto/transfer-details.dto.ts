import { OmitType } from '@nestjs/swagger';

import { TransactionDetailsDto } from '@/transactions/dto/transaction-details.dto';

export class TransferDetailsDto extends OmitType(
  TransactionDetailsDto,
  [] as const,
) {}
