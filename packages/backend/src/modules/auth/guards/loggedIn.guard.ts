import { ExecutionContext, Injectable } from '@nestjs/common';

import { BaseGuard } from './base.guard';

@Injectable()
export class LoggedInGuard extends BaseGuard {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const user = this.getRequestUser(context);

    return Boolean(user);
  }
}
