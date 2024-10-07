import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Observable } from 'rxjs';

export abstract class BaseGuard implements CanActivate {
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  protected getRequestUser(context: ExecutionContext): User {
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
}
