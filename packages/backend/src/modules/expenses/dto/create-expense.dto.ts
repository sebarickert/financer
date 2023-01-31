import { OmitType } from '@silte/nestjs-swagger';

import { ExpenseDto } from './expense.dto';

export class CreateExpenseDto extends OmitType(ExpenseDto, [
  '_id',
  'user',
] as const) {}
