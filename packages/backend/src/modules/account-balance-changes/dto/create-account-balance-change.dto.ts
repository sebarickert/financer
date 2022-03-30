import { OmitType } from '@nestjs/mapped-types';

import { AccountBalanceChangeDto } from './account-balance-change.dto';

export class CreateAccountBalanceChangeDto extends OmitType(
  AccountBalanceChangeDto,
  ['_id'] as const,
) {}
