import { OmitType } from '@nestjs/swagger';

import { AccountBalanceChangeDto } from './account-balance-change.dto';

export class CreateAccountBalanceChangeDto extends OmitType(
  AccountBalanceChangeDto,
  ['id', 'createdAt', 'updatedAt', 'userId'] as const,
) {}
