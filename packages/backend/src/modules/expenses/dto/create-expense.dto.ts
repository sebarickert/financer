import { OmitType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';

export class CreateExpenseDto extends OmitType(CreateTransactionDto, [
  'toAccount',
] as const) {}
