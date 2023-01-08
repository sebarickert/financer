import { OmitType } from '@nestjs/swagger';

import { AccountDto } from './account.dto';

export class CreateAccountDto extends OmitType(AccountDto, [
  '_id',
  'owner',
  'isDeleted',
] as const) {}
