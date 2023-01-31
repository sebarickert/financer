import { PartialType } from '@silte/nestjs-swagger';

import { CreateTransactionTemplateDto } from './create-transaction-template.dto';

export class UpdateTransactionTemplateDto extends PartialType(
  CreateTransactionTemplateDto,
) {}
