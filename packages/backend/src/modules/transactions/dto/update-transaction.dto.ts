import { PartialType } from '@silte/nestjs-swagger';

import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
