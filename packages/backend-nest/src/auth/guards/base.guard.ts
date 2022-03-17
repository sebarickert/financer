import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { isNodeEnvInTest } from 'src/config/configuration';
import { DUMMY_TEST_USER } from 'src/config/mockAuthenticationMiddleware';
import { UserDocument } from 'src/users/schemas/user.schema';

export abstract class BaseGuard implements CanActivate {
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    throw new Error('Method not implemented.');
  }

  protected getRequestUser(context: ExecutionContext): UserDocument {
    if (isNodeEnvInTest()) {
      return DUMMY_TEST_USER as UserDocument;
    }
    const request = context.switchToHttp().getRequest();
    return request.user;
  }
}
