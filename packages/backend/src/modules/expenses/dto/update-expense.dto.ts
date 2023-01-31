import { PartialType } from '@silte/nestjs-swagger';

import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
