import { OmitType } from '@nestjs/mapped-types';

import { AccountDto } from './account.dto';

export class CreateAccountDto extends OmitType(AccountDto, [
  '_id',
  'owner',
] as const) {}
