import { OmitType } from '@silte/nestjs-swagger';

import { TransferDto } from './transfer.dto';

export class CreateTransferDto extends OmitType(TransferDto, [
  '_id',
  'user',
] as const) {}
