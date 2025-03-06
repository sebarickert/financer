import { OmitType } from '@nestjs/swagger';

import { AccountDto } from './account.dto';

export class CreateAccountDto extends OmitType(AccountDto, [
  'id',
  'userId',
  'isDeleted',
  'createdAt',
  'updatedAt',
  'currentDateBalance',
] as const) {
  constructor(data?: Partial<CreateAccountDto>) {
    super();

    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.balance = data.balance;
      // @ts-expect-error - we have to manually assign these properties
      this.name = data.name;
      // @ts-expect-error - we have to manually assign these properties
      this.type = data.type;
    }
  }
}
