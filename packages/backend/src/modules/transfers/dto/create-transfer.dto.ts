import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Allow, IsUUID } from 'class-validator';

import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';
import { IsNotEqual } from '@/utils/is-not-equal.decorator';

export class CreateTransferDto extends OmitType(
  CreateTransactionDto,
  [] as const,
) {
  constructor(data?: CreateTransferDto) {
    super();
    if (data) {
      // @ts-expect-error - we have to manually assign these properties
      this.amount = data.amount;
      // @ts-expect-error - we have to manually assign these properties
      this.description = data.description;
      // @ts-expect-error - we have to manually assign these properties
      this.date = data.date;

      this.fromAccount = data.fromAccount;
      this.toAccount = data.toAccount;
      this.categories = data.categories;
    }
  }

  @ApiProperty({ type: String })
  @Allow()
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  @IsUUID('all', { message: 'fromAccount must not be empty.' })
  readonly fromAccount!: string;

  @ApiProperty({ type: String })
  @IsUUID('all', { message: 'toAccount must not be empty.' })
  readonly toAccount!: string;
}
