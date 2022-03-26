import { IntersectionType, OmitType } from '@nestjs/mapped-types';

import { CreateTransactionBaseWithCategoryDto } from '../../transactions/dto/create-transaction.dto';

import { ExpenseDto } from './expense.dto';

export class CreateExpenseDto extends IntersectionType(
  OmitType(ExpenseDto, ['_id', 'fromAccountBalance', 'user'] as const),
  CreateTransactionBaseWithCategoryDto,
) {}
