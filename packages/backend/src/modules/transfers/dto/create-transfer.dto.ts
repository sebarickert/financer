import { IntersectionType, OmitType } from '@nestjs/mapped-types';

import { CreateTransactionBaseWithCategoryDto } from '../../transactions/dto/create-transaction.dto';

import { TransferDto } from './transfer.dto';

export class CreateTransferDto extends IntersectionType(
  OmitType(TransferDto, ['_id', 'user'] as const),
  CreateTransactionBaseWithCategoryDto,
) {}
