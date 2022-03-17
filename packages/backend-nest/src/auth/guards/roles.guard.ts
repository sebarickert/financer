import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { BaseGuard } from './base.guard';

@Injectable()
export class RolesGuard extends BaseGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const user = this.getRequestUser(context);
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
