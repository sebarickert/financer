import { OmitType } from '@nestjs/swagger';

import { TransferDto } from './transfer.dto';

export class CreateTransferDto extends OmitType(TransferDto, [
  'id',
  'userId',
  'createdAt',
  'updatedAt',
] as const) {}
