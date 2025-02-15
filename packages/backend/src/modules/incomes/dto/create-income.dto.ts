import { OmitType } from '@nestjs/swagger';

import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';

export class CreateIncomeDto extends OmitType(CreateTransactionDto, [
  'fromAccount',
] as const) {}
