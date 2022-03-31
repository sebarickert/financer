import { IntersectionType, OmitType } from '@nestjs/mapped-types';

import { CreateTransactionBaseWithCategoryDto } from '../../transactions/dto/create-transaction.dto';

import { IncomeDto } from './income.dto';

export class CreateIncomeDto extends IntersectionType(
  OmitType(IncomeDto, ['_id', 'user'] as const),
  CreateTransactionBaseWithCategoryDto,
) {}
