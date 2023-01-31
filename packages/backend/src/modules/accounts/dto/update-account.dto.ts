import { PartialType } from '@silte/nestjs-swagger';

import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
