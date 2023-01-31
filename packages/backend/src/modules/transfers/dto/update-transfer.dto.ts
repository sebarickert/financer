import { PartialType } from '@silte/nestjs-swagger';

import { CreateTransferDto } from './create-transfer.dto';

export class UpdateTransferDto extends PartialType(CreateTransferDto) {}
