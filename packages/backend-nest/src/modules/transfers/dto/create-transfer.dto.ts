import { OmitType } from '@nestjs/mapped-types';

import { TransferDto } from './transfer.dto';

export class CreateTransferDto extends OmitType(TransferDto, [
  '_id',
  'toAccountBalance',
  'fromAccountBalance',
  'user',
] as const) {}
