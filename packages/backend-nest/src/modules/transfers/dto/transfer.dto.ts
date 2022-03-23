import { IsMongoId } from 'class-validator';

import { IsNotEqual } from '../../../utils/is-not-equal.decorator';
import { Account } from '../../accounts/schemas/account.schema';
import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class TransferDto extends TransactionDto {
  @IsMongoId({ message: 'fromAccount must not be empty.' })
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  fromAccount: Account;
}
