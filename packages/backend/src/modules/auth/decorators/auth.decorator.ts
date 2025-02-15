import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { ROLES_KEY, RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: string[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
