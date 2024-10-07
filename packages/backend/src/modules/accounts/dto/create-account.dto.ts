import { OmitType } from '@nestjs/swagger';

import { AccountDto } from './account.dto';

export class CreateAccountDto extends OmitType(AccountDto, [
  'id',
  'userId',
  'isDeleted',
  'createdAt',
  'updatedAt',
] as const) {}
