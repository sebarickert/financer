import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesGuard } from '../guards/roles.guard';

export const Auth = (...roles: string[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(RolesGuard));
