import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

export abstract class BaseGuard implements CanActivate {
  abstract canActivate(context: ExecutionContext): boolean | Promise<boolean>;

  protected getRequestUser(context: ExecutionContext): User {
    const request: Request = context.switchToHttp().getRequest();
    return request.user as User;
  }
}
