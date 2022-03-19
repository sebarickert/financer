import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesGuard, ROLES_KEY } from '../guards/roles.guard';

export const Auth = (...roles: string[]) =>
  applyDecorators(SetMetadata(ROLES_KEY, roles), UseGuards(RolesGuard));
