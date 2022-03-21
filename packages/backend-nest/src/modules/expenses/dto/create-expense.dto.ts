import { OmitType } from '@nestjs/mapped-types';

import { ExpenseDto } from './expense.dto';

export class CreateExpenseDto extends OmitType(ExpenseDto, [
  '_id',
  'fromAccountBalance',
  'user',
] as const) {}
