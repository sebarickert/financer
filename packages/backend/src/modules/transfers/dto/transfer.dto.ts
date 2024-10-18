import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsUUID } from 'class-validator';

import { IsNotEqual } from '../../../utils/is-not-equal.decorator';
import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class TransferDto extends TransactionDto {
  @ApiProperty({ type: String })
  @Allow()
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  @IsUUID('all', { message: 'fromAccount must not be empty.' })
  declare fromAccount: string;
}
