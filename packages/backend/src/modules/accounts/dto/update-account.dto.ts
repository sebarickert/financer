import { PartialType } from '@nestjs/swagger';

import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  constructor(data?: Partial<UpdateAccountDto>) {
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
