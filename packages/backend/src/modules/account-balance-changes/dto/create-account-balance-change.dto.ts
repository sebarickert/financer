import { OmitType } from '@nestjs/swagger';

import { AccountBalanceChangeDto } from './account-balance-change.dto';

export class CreateAccountBalanceChangeDto extends OmitType(
  AccountBalanceChangeDto,
  ['id', 'createdAt', 'updatedAt', 'userId'] as const,
) {
  constructor(data?: CreateAccountBalanceChangeDto) {
    super(data);

    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.accountId = data.accountId;
    }
  }
}
