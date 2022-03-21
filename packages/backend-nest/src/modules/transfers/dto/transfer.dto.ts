import { IsMongoId } from 'class-validator';
import { Account } from 'src/modules/accounts/schemas/account.schema';
import { IsNotEqual } from 'src/utils/is-not-equal.decorator';

import { TransactionDto } from '../../transactions/dto/transaction.dto';
export class TransferDto extends TransactionDto {
  @IsMongoId({ message: 'fromAccount must not be empty.' })
  @IsNotEqual('toAccount', {
    message: "Target and source accounts can't be the same account.",
  })
  fromAccount: Account;
}
